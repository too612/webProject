package com.main.app.common.excel;

import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.web.server.ResponseStatusException;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;

class ExcelServiceTest {
    @TempDir Path directory;
    private final ExcelSnapshotStore store = new ExcelSnapshotStore(1800, 256);
    private final MockHttpSession session = new MockHttpSession();
    private final List<ExcelModel.Column> columns = List.of(
            new ExcelModel.Column("no", "NO", 72), new ExcelModel.Column("employee", "사번", 120),
            new ExcelModel.Column("detail", "상세", 90));

    private ExcelImageLoader images() { return new ExcelImageLoader(directory.toString(), 2097152, null); }
    private ExcelService service(int rows, long cells) {
        return new ExcelService(store, images(), rows, 5000, cells, 10, 20971520, 52428800, 2);
    }
    private ExcelModel.Snapshot snapshot(int count) {
        return new ExcelModel.Snapshot(columns, IntStream.range(0, count).mapToObj(index ->
                new ExcelModel.Row(Map.of("no", ExcelModel.Cell.number(index + 1),
                        "employee", ExcelModel.Cell.text(index == 0 ? "00123" : "=1+1"),
                        "detail", ExcelModel.Cell.text("상세보기")))).toList(), count);
    }
    private String issue(ExcelModel.Snapshot snapshot) {
        session.setAttribute("userId", "excel-test");
        return store.issue(session, snapshot, () -> snapshot);
    }
    private ExcelModel.Sheet sheet(String name, String token, int count, List<ExcelModel.Column> cols) {
        return new ExcelModel.Sheet(name, cols, List.of(new ExcelModel.Block(token, IntStream.range(0, count).boxed().toList())));
    }
    @Test void generatesThreeSheetsWithoutLosingStringsOrDisplayText() throws Exception {
        var snapshot = snapshot(2);
        var token = issue(snapshot);
        var request = new ExcelModel.Request("인사관리", List.of(
                sheet("탭1", token, 2, columns), sheet("탭2", token, 2, columns), sheet("탭3", token, 2, columns)));
        var path = service(100000, 2000000).generate(request, session);
        try (var workbook = new XSSFWorkbook(Files.newInputStream(path))) {
            assertEquals(3, workbook.getNumberOfSheets());
            for (int index = 0; index < 3; index++) {
                var sheet = workbook.getSheetAt(index);
                assertEquals("탭" + (index + 1), sheet.getSheetName());
                assertEquals(2, sheet.getLastRowNum());
                assertEquals(CellType.NUMERIC, sheet.getRow(1).getCell(0).getCellType());
                assertEquals(1, sheet.getRow(1).getCell(0).getNumericCellValue());
                assertEquals("00123", sheet.getRow(1).getCell(1).getStringCellValue());
                assertEquals(CellType.STRING, sheet.getRow(2).getCell(1).getCellType());
                assertEquals("=1+1", sheet.getRow(2).getCell(1).getStringCellValue());
                assertEquals("상세보기", sheet.getRow(1).getCell(2).getStringCellValue());
                assertTrue(sheet.getPaneInformation().isFreezePane());
            }
        } finally { Files.delete(path); }
    }
    @Test void rejectsChangedSnapshotOtherSessionUserAndUnknownColumns() throws Exception {
        var original = snapshot(1);
        var current = new AtomicReference<>(original);
        session.setAttribute("userId", "owner");
        String token = store.issue(session, original, current::get);
        assertThrows(ResponseStatusException.class, () -> store.verify(new MockHttpSession(), token));
        session.setAttribute("userId", "different");
        assertThrows(ResponseStatusException.class, () -> store.verify(session, token));
        session.setAttribute("userId", "owner");
        current.set(snapshot(2));
        assertThrows(ResponseStatusException.class, () -> store.verify(session, token));
        current.set(original);
        var invalid = new ExcelModel.Request("test", List.of(sheet("tab", token, 1,
                List.of(new ExcelModel.Column("secret", "비공개", 100)))));
        assertThrows(IllegalArgumentException.class, () -> service(100000, 2000000).generate(invalid, session));
    }
    @Test void rowAndCellLimitsCountAllSheetsAndHeaders() throws Exception {
        String token = issue(snapshot(2));
        var request = new ExcelModel.Request("test", List.of(sheet("tab", token, 2, columns)));
        var path = service(2, 9).generate(request, session);
        Files.delete(path);
        assertThrows(ResponseStatusException.class, () -> service(1, 9).generate(request, session));
        assertThrows(ResponseStatusException.class, () -> service(2, 8).generate(request, session));
        var two = new ExcelModel.Request("test", List.of(sheet("tab1", token, 2, columns), sheet("tab2", token, 2, columns)));
        assertThrows(ResponseStatusException.class, () -> service(3, 18).generate(two, session));
    }
    @Test void includesImageAndRejectsImageChangeOrExternalPath() throws Exception {
        ImageIO.write(new BufferedImage(2, 2, BufferedImage.TYPE_INT_RGB), "png", directory.resolve("profile.png").toFile());
        var loader = images();
        var cols = List.of(new ExcelModel.Column("photo", "프로필", 88));
        var snapshot = new ExcelModel.Snapshot(cols, List.of(new ExcelModel.Row(Map.of("photo",
                new ExcelModel.Cell("", null, "/data/profile.png", loader.fingerprint("/data/profile.png"), null)))), 1);
        String token = issue(snapshot);
        var request = new ExcelModel.Request("test", List.of(sheet("tab", token, 1, cols)));
        var path = service(100000, 2000000).generate(request, session);
        try (var workbook = new XSSFWorkbook(Files.newInputStream(path))) {
            assertEquals(1, workbook.getAllPictures().size());
            assertEquals(1, workbook.getSheetAt(0).getDrawingPatriarch().getShapes().size());
        } finally { Files.delete(path); }
        ImageIO.write(new BufferedImage(3, 3, BufferedImage.TYPE_INT_RGB), "png", directory.resolve("profile.png").toFile());
        assertThrows(ResponseStatusException.class, () -> service(100000, 2000000).generate(request, session));
        assertThrows(ResponseStatusException.class, () -> loader.read("https://example.com/photo.png"));
        assertThrows(ResponseStatusException.class, () -> loader.read("/data/../outside.png"));
    }
    @Test void controllerRequiresLoginAndReturnsActualXlsx() throws Exception {
        var controller = new ExcelController(service(100000, 2000000));
        var request = new MockHttpServletRequest();
        String token = issue(snapshot(1));
        var body = new ExcelModel.Request("인사관리", List.of(sheet("tab", token, 1, columns)));
        assertThrows(ResponseStatusException.class, () -> controller.download(body, request, new MockHttpServletResponse()));
        request.setSession(session);
        var response = new MockHttpServletResponse();
        controller.download(body, request, response);
        assertEquals("no-store", response.getHeader("Cache-Control"));
        assertTrue(response.getHeader("Content-Disposition").contains(".xlsx"));
        assertTrue(response.getContentType().contains("spreadsheetml.sheet"));
        try (var workbook = new XSSFWorkbook(new ByteArrayInputStream(response.getContentAsByteArray()))) {
            assertEquals("00123", workbook.getSheetAt(0).getRow(1).getCell(1).getStringCellValue());
        }
    }
    @Test void unsupportedImageOnlyIsOmittedWhileInternalImageAndRowValuesRemain() throws Exception {
        ImageIO.write(new BufferedImage(2, 2, BufferedImage.TYPE_INT_RGB), "png", directory.resolve("profile.png").toFile());
        var cols = List.of(new ExcelModel.Column("employee", "사번", 120),
                new ExcelModel.Column("photo", "프로필", 88), new ExcelModel.Column("detail", "상세", 90));
        var rows = List.of(
                new ExcelModel.Row(Map.of("employee", ExcelModel.Cell.text("00123"), "detail", ExcelModel.Cell.text("상세보기"),
                        "photo", new ExcelModel.Cell("", null, "https://example.com/photo.png",
                        "error:엑셀 프로필은 내부 PNG/JPEG 파일만 지원합니다. 외부 이미지는 허용하지 않습니다.", null))),
                new ExcelModel.Row(Map.of("employee", ExcelModel.Cell.text("00456"), "detail", ExcelModel.Cell.text("상세보기"),
                        "photo", new ExcelModel.Cell("", null, "/data/profile.png", images().fingerprint("/data/profile.png"), null))));
        String token = issue(new ExcelModel.Snapshot(cols, rows, 2));
        var path = service(100000, 2000000).generate(new ExcelModel.Request("test", List.of(sheet("tab", token, 2, cols))), session);
        try (var workbook = new XSSFWorkbook(Files.newInputStream(path))) {
            var sheet = workbook.getSheetAt(0);
            assertEquals(2, sheet.getLastRowNum());
            assertEquals("00123", sheet.getRow(1).getCell(0).getStringCellValue());
            assertEquals("", sheet.getRow(1).getCell(1).getStringCellValue());
            assertEquals("상세보기", sheet.getRow(1).getCell(2).getStringCellValue());
            assertEquals("00456", sheet.getRow(2).getCell(0).getStringCellValue());
            assertEquals(1, workbook.getAllPictures().size());
            assertEquals(1, sheet.getDrawingPatriarch().getShapes().size());
            assertEquals(2, ((org.apache.poi.xssf.usermodel.XSSFPicture)
                    sheet.getDrawingPatriarch().getShapes().getFirst()).getClientAnchor().getRow1());
        } finally { Files.delete(path); }
    }
    @Test void unsupportedImagesDoNotApplyImageRowLimitButInternalFailuresStillStopDownload() throws Exception {
        var cols = List.of(new ExcelModel.Column("photo", "프로필", 88));
        var external = new ExcelModel.Row(Map.of("photo",
                new ExcelModel.Cell("", null, "https://example.com/photo.png", null, null)));
        String token = issue(new ExcelModel.Snapshot(cols, java.util.Collections.nCopies(5001, external), 5001));
        var path = service(100000, 2000000).generate(new ExcelModel.Request("test", List.of(sheet("tab", token, 5001, cols))), session);
        try (var workbook = new XSSFWorkbook(Files.newInputStream(path))) {
            assertEquals(5001, workbook.getSheetAt(0).getLastRowNum());
            assertTrue(workbook.getAllPictures().isEmpty());
        } finally { Files.delete(path); }
        var invalid = new ExcelModel.Row(Map.of("photo",
                new ExcelModel.Cell("", null, "/data/broken.png", "error:엑셀 이미지 형식이 올바르지 않습니다.", null)));
        String invalidToken = issue(new ExcelModel.Snapshot(cols, List.of(invalid), 1));
        assertThrows(ResponseStatusException.class, () -> service(100000, 2000000).generate(
                new ExcelModel.Request("test", List.of(sheet("tab", invalidToken, 1, cols))), session));
    }
    @Test void defaultLimitsAllowExactlyOneHundredThousandRowsAndTwoMillionCells() throws Exception {
        for (int width : List.of(19, 20)) {
            int count = width == 19 ? 100000 : 99999;
            var cols = IntStream.range(0, width).mapToObj(index ->
                    new ExcelModel.Column("column" + index, "Column " + index, 100)).toList();
            var values = new java.util.LinkedHashMap<String, ExcelModel.Cell>();
            cols.forEach(column -> values.put(column.id(), ExcelModel.Cell.text("00123")));
            var row = new ExcelModel.Row(values);
            var snapshot = new ExcelModel.Snapshot(cols, java.util.Collections.nCopies(count, row), count);
            String token = issue(snapshot);
            var request = new ExcelModel.Request("large", List.of(sheet("tab", token, count, cols)));
            var path = service(100000, 2000000).generate(request, session);
            try (var zip = new java.util.zip.ZipFile(path.toFile());
                 var input = zip.getInputStream(zip.getEntry("xl/worksheets/sheet1.xml"))) {
                var factory = javax.xml.stream.XMLInputFactory.newFactory();
                factory.setProperty(javax.xml.stream.XMLInputFactory.SUPPORT_DTD, false);
                factory.setProperty("javax.xml.stream.isSupportingExternalEntities", false);
                var xml = factory.createXMLStreamReader(input);
                int rows = 0;
                long cells = 0;
                try {
                    while (xml.hasNext()) {
                        if (xml.next() == javax.xml.stream.XMLStreamConstants.START_ELEMENT) {
                            if ("row".equals(xml.getLocalName())) rows++;
                            if ("c".equals(xml.getLocalName())) cells++;
                        }
                    }
                } finally { xml.close(); }
                assertEquals(count + 1, rows);
                assertEquals((long) (count + 1) * width, cells);
                if (width == 20) assertEquals(2000000, cells);
            } finally { Files.delete(path); }
            var over = new ExcelModel.Request("large", List.of(sheet("tab", token, count + 1, cols)));
            assertThrows(ResponseStatusException.class, () -> service(100000, 2000000).generate(over, session));
        }
    }
    @Test void imageLimitAllowsFiveThousandRowsWithDeduplicatedPictureAndRejectsOneMore() throws Exception {
        ImageIO.write(new BufferedImage(2, 2, BufferedImage.TYPE_INT_RGB), "png", directory.resolve("profile.png").toFile());
        var cols = List.of(new ExcelModel.Column("photo", "프로필", 88));
        var row = new ExcelModel.Row(Map.of("photo",
                new ExcelModel.Cell("", null, "/data/profile.png", images().fingerprint("/data/profile.png"), null)));
        String token = issue(new ExcelModel.Snapshot(cols, java.util.Collections.nCopies(5001, row), 5001));
        var request = new ExcelModel.Request("photos", List.of(sheet("tab", token, 5000, cols)));
        var path = service(100000, 2000000).generate(request, session);
        try (var workbook = new XSSFWorkbook(Files.newInputStream(path))) {
            assertEquals(5000, workbook.getSheetAt(0).getLastRowNum());
            assertEquals(1, workbook.getAllPictures().size());
            assertEquals(5000, workbook.getSheetAt(0).getDrawingPatriarch().getShapes().size());
        } finally { Files.delete(path); }
        var over = new ExcelModel.Request("photos", List.of(sheet("tab", token, 5001, cols)));
        assertThrows(ResponseStatusException.class, () -> service(100000, 2000000).generate(over, session));
    }
    @Test void requestBodyLimitChecksActualBytesWithoutContentLength() throws Exception {
        var request = new MockHttpServletRequest("POST", "/api/common/excel/download") {
            @Override public long getContentLengthLong() { return -1; }
        };
        request.setServletPath("/api/common/excel/download");
        request.setContent(new byte[11]);
        var response = new MockHttpServletResponse();
        var reachedController = new java.util.concurrent.atomic.AtomicBoolean();
        new ExcelRequestLimitFilter(10).doFilter(request, response, (req, res) -> reachedController.set(true));
        assertFalse(reachedController.get());
        assertEquals(413, response.getStatus());
        assertTrue(response.getContentAsString().contains("\"success\":false"));
    }
}