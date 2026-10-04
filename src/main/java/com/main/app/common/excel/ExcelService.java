package com.main.app.common.excel;

import jakarta.servlet.http.HttpSession;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.WorkbookUtil;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.Semaphore;

@Service
public class ExcelService {
    private static final Logger log = LoggerFactory.getLogger(ExcelService.class);
    private final ExcelSnapshotStore snapshots;
    private final ExcelImageLoader images;
    private final int maxRows, maxImageRows, maxSheets;
    private final long maxCells, maxImageBytes, maxTextBytes;
    private final Semaphore slots;
    private record Picture(String hash, int index) {}

    public ExcelService(ExcelSnapshotStore snapshots, ExcelImageLoader images,
                        @Value("${app.excel.max-rows:100000}") int maxRows,
                        @Value("${app.excel.max-image-rows:5000}") int maxImageRows,
                        @Value("${app.excel.max-cells:2000000}") long maxCells,
                        @Value("${app.excel.max-sheets:10}") int maxSheets,
                        @Value("${app.excel.max-total-image-bytes:20971520}") long maxImageBytes,
                        @Value("${app.excel.max-text-bytes:52428800}") long maxTextBytes,
                        @Value("${app.excel.concurrent-exports:2}") int concurrency) {
        if (maxRows <= 0 || maxImageRows <= 0 || maxCells <= 0 || maxSheets <= 0 ||
                maxImageBytes <= 0 || maxTextBytes <= 0 || concurrency <= 0) throw new IllegalArgumentException("엑셀 생성 제한이 올바르지 않습니다.");
        this.snapshots = snapshots;
        this.images = images;
        this.maxRows = maxRows;
        this.maxImageRows = maxImageRows;
        this.maxCells = maxCells;
        this.maxSheets = maxSheets;
        this.maxImageBytes = maxImageBytes;
        this.maxTextBytes = maxTextBytes;
        slots = new Semaphore(concurrency);
    }
    public static String fileName(String name) {
        if (name == null || name.isBlank() || name.length() > 150 ||
                java.util.regex.Pattern.compile("[\\\\/:*?\"<>|\\p{Cntrl}]").matcher(name).find()) {
            throw new IllegalArgumentException("엑셀 파일명이 올바르지 않습니다.");
        }
        return name.toLowerCase(Locale.ROOT).endsWith(".xlsx") ? name : name + ".xlsx";
    }
    @Transactional(readOnly = true, isolation = Isolation.REPEATABLE_READ)
    public Path generate(ExcelModel.Request request, HttpSession session) throws IOException {
        long totalRows = validate(request);
        if (!slots.tryAcquire()) throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "엑셀 생성 요청이 많습니다. 잠시 후 다시 시도하세요.");
        Path output = null;
        boolean completed = false;
        try {
            output = Files.createTempFile("webproject-excel-", ".xlsx");
            try (var workbook = new SXSSFWorkbook(100)) {
                try {
                    workbook.setCompressTempFiles(true);
                    Map<String, CellStyle> styles = new HashMap<>();
                    Map<String, Picture> imageCache = new HashMap<>();
                    Map<String, Integer> pictureIndexes = new HashMap<>();
                    long imageBytes = 0, textBytes = 0;
                    int skippedImages = 0;
                    var header = workbook.createCellStyle();
                    var font = workbook.createFont();
                    font.setBold(true);
                    header.setFont(font);
                    header.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
                    header.setFillPattern(FillPatternType.SOLID_FOREGROUND);
                    for (var target : request.sheets()) {
                        var first = snapshots.verify(session, target.blocks().getFirst().token());
                        validateColumns(target.columns(), first.columns());
                        var sheet = workbook.createSheet(target.name());
                        sheet.createFreezePane(0, 1);
                        var headings = sheet.createRow(0);
                        for (int col = 0; col < target.columns().size(); col++) {
                            var column = target.columns().get(col);
                            textBytes += column.title().getBytes(StandardCharsets.UTF_8).length;
                            checkTextBytes(textBytes);
                            var cell = headings.createCell(col);
                            cell.setCellValue(column.title());
                            cell.setCellStyle(header);
                            sheet.setColumnWidth(col, Math.clamp(column.width() / 7 * 256, 8 * 256, 100 * 256));
                        }
                        Drawing<?> drawing = null;
                        int rowIndex = 1;
                        Set<String> seen = new HashSet<>();
                        for (var block : target.blocks()) {
                            var snapshot = block == target.blocks().getFirst() ? first : snapshots.verify(session, block.token());
                            validateColumns(target.columns(), snapshot.columns());
                            for (int index : block.indexes()) {
                                if (index < 0 || index >= snapshot.rows().size() || !seen.add(block.token() + ":" + index)) {
                                    throw new IllegalArgumentException("엑셀 행 참조가 올바르지 않거나 중복되었습니다.");
                                }
                                if (Thread.currentThread().isInterrupted()) throw new IOException("엑셀 생성이 취소되었습니다.");
                                var row = sheet.createRow(rowIndex++);
                                for (int col = 0; col < target.columns().size(); col++) {
                                    var content = snapshot.rows().get(index).cells().get(target.columns().get(col).id());
                                    if (content == null || content.text() == null) throw new IllegalArgumentException("엑셀 열 데이터가 없습니다.");
                                    if (content.text().length() > 32767) throw new IllegalArgumentException("엑셀 셀의 32,767자 제한을 초과했습니다.");
                                    textBytes += content.text().getBytes(StandardCharsets.UTF_8).length;
                                    checkTextBytes(textBytes);
                                    var cell = row.createCell(col);
                                    if (content.number() == null) cell.setCellValue(content.text());
                                    else cell.setCellValue(content.number());
                                    cell.setCellStyle(styles.computeIfAbsent(content.fill() == null ? "" : content.fill(), color -> style(workbook, color)));
                                    if (content.imagePath() == null) continue;
                                    if (!images.supportsLocation(content.imagePath())) {
                                        cell.setCellValue("");
                                        skippedImages++;
                                        continue;
                                    }
                                    if (content.imageHash() != null && content.imageHash().startsWith("error:")) {
                                        throw new ResponseStatusException(HttpStatus.CONFLICT, content.imageHash().substring(6));
                                    }
                                    if (totalRows > maxImageRows) throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "이미지 포함 엑셀의 행 제한을 초과했습니다.");
                                    Picture picture = imageCache.get(content.imagePath());
                                    if (picture == null) {
                                        byte[] bytes = images.read(content.imagePath());
                                        String hash = images.hash(bytes);
                                        if (!hash.equals(content.imageHash())) throw new ResponseStatusException(HttpStatus.CONFLICT, "프로필 이미지가 변경되었습니다. 다시 조회하세요.");
                                        Integer pictureIndex = pictureIndexes.get(hash);
                                        if (pictureIndex == null) {
                                            imageBytes += bytes.length;
                                            if (imageBytes > maxImageBytes) throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "엑셀 이미지 합계 용량 제한을 초과했습니다.");
                                            pictureIndex = workbook.addPicture(bytes, bytes[0] == (byte) 0x89 ? Workbook.PICTURE_TYPE_PNG : Workbook.PICTURE_TYPE_JPEG);
                                            pictureIndexes.put(hash, pictureIndex);
                                        }
                                        picture = new Picture(hash, pictureIndex);
                                        imageCache.put(content.imagePath(), picture);
                                    }
                                    if (!picture.hash().equals(content.imageHash())) throw new ResponseStatusException(HttpStatus.CONFLICT, "프로필 이미지가 변경되었습니다. 다시 조회하세요.");
                                    if (drawing == null) drawing = sheet.createDrawingPatriarch();
                                    var anchor = workbook.getCreationHelper().createClientAnchor();
                                    anchor.setCol1(col);
                                    anchor.setCol2(col + 1);
                                    anchor.setRow1(row.getRowNum());
                                    anchor.setRow2(row.getRowNum() + 1);
                                    drawing.createPicture(anchor, picture.index());
                                    row.setHeightInPoints(32);
                                    cell.setCellValue("");
                                }
                            }
                        }
                        sheet.setAutoFilter(new CellRangeAddress(0, rowIndex - 1, 0, target.columns().size() - 1));
                    }
                    try (var stream = Files.newOutputStream(output)) { workbook.write(stream); }
                    if (skippedImages > 0) {
                        log.warn("Excel export omitted {} image cells with unsupported locations; row data was preserved.", skippedImages);
                    }
                } finally {
                    for (int index = 0; index < workbook.getNumberOfSheets(); index++) workbook.getSheetAt(index).flushRows();
                }
            }
            completed = true;
            return output;
        } finally {
            slots.release();
            if (!completed && output != null) Files.deleteIfExists(output);
        }
    }
    private void checkTextBytes(long bytes) {
        if (bytes > maxTextBytes) throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "엑셀 텍스트 합계 용량 제한을 초과했습니다.");
    }
    private CellStyle style(SXSSFWorkbook workbook, String color) {
        var style = (XSSFCellStyle) workbook.createCellStyle();
        style.setWrapText(true);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        if (!color.isEmpty()) {
            style.setFillForegroundColor(new XSSFColor(HexFormat.of().parseHex(color), null));
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        }
        return style;
    }
    private long validate(ExcelModel.Request request) {
        if (request == null) throw new IllegalArgumentException("엑셀 요청이 없습니다.");
        fileName(request.fileName());
        if (request.sheets() == null || request.sheets().isEmpty() || request.sheets().size() > maxSheets) throw new IllegalArgumentException("엑셀 시트 수가 올바르지 않습니다.");
        Set<String> names = new HashSet<>();
        long rows = 0, cells = 0;
        for (var sheet : request.sheets()) {
            if (sheet == null || sheet.name() == null) throw new IllegalArgumentException("엑셀 시트명이 없습니다.");
            WorkbookUtil.validateSheetName(sheet.name());
            if (!names.add(sheet.name().toLowerCase(Locale.ROOT))) throw new IllegalArgumentException("엑셀 시트명이 중복되었습니다.");
            if (sheet.columns() == null || sheet.columns().isEmpty() || sheet.columns().size() > 16384 ||
                    sheet.blocks() == null || sheet.blocks().isEmpty()) throw new IllegalArgumentException("엑셀 열 또는 조회 정보가 없습니다.");
            for (var column : sheet.columns()) {
                if (column == null || column.id() == null || column.id().isBlank() || column.id().length() > 100 ||
                        column.title() == null || column.title().length() > 32767 || column.width() < 1 || column.width() > 10000) {
                    throw new IllegalArgumentException("엑셀 열 정의가 올바르지 않습니다.");
                }
            }
            long sheetRows = 0;
            for (var block : sheet.blocks()) {
                if (block == null || block.token() == null || block.token().length() > 100 ||
                        block.indexes() == null || block.indexes().stream().anyMatch(Objects::isNull)) throw new IllegalArgumentException("엑셀 행 참조가 올바르지 않습니다.");
                sheetRows += block.indexes().size();
            }
            rows += sheetRows;
            cells += (sheetRows + 1) * sheet.columns().size();
            if (sheetRows > 1048575 || rows > maxRows || cells > maxCells) throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "엑셀 행 또는 전체 셀 수 제한을 초과했습니다.");
        }
        return rows;
    }
    private void validateColumns(List<ExcelModel.Column> requested, List<ExcelModel.Column> allowed) {
        Set<String> ids = new HashSet<>();
        for (var column : requested) {
            if (!ids.add(column.id()) || allowed.stream().noneMatch(item -> item.id().equals(column.id()) && item.title().equals(column.title()))) {
                throw new IllegalArgumentException("허용되지 않거나 중복된 엑셀 열입니다.");
            }
        }
    }
}