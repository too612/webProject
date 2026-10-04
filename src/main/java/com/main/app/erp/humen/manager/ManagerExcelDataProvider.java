package com.main.app.erp.humen.manager;

import com.main.app.common.excel.*;
import com.main.app.erp.humen.manager.dto.ManagerDto;
import jakarta.servlet.http.HttpSession;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import java.util.LinkedHashMap;
import java.util.List;

@Component
public class ManagerExcelDataProvider implements ExcelDataProvider<Page<ManagerDto.Person>> {
    private static final List<ExcelModel.Column> COLUMNS = List.of(
            new ExcelModel.Column("rowNumber", "NO", 72), new ExcelModel.Column("nameKo", "성명", 120),
            new ExcelModel.Column("employeeNo", "사번", 130), new ExcelModel.Column("profilePhotoUrl", "프로필", 88),
            new ExcelModel.Column("gradeName", "직급", 100), new ExcelModel.Column("positionName", "직위", 130),
            new ExcelModel.Column("deptName", "소속 부서", 140), new ExcelModel.Column("employmentTypeName", "고용형태", 110),
            new ExcelModel.Column("hireDate", "입사일", 110), new ExcelModel.Column("serviceStatusName", "재직 상태", 110),
            new ExcelModel.Column("detail", "상세", 90));
    private final ManagerService service;
    private final ExcelSnapshotStore snapshots;
    private final ExcelImageLoader images;
    public ManagerExcelDataProvider(ManagerService service, ExcelSnapshotStore snapshots, ExcelImageLoader images) {
        this.service = service; this.snapshots = snapshots; this.images = images;
    }
    public String issue(HttpSession session, ManagerDto.ListQuery query, Page<ManagerDto.Person> page) {
        return snapshots.issue(session, snapshot(page), () -> snapshot(service.getPersonList(query)));
    }
    @Override public ExcelModel.Snapshot snapshot(Page<ManagerDto.Person> page) {
        var rows = java.util.stream.IntStream.range(0, page.getNumberOfElements()).mapToObj(index -> {
            var person = page.getContent().get(index);
            var cells = new LinkedHashMap<String, ExcelModel.Cell>();
            cells.put("rowNumber", ExcelModel.Cell.number((long) page.getNumber() * page.getSize() + index + 1));
            cells.put("nameKo", ExcelModel.Cell.text(person.getNameKo()));
            cells.put("employeeNo", ExcelModel.Cell.text(person.getEmployeeNo()));
            String photo = person.getProfilePhotoUrl();
            if (photo == null || photo.isBlank()) cells.put("profilePhotoUrl", ExcelModel.Cell.text(
                    person.getNameKo() == null || person.getNameKo().isEmpty() ? "?" : person.getNameKo().substring(0, 1)));
            else {
                String hash = null;
                try {
                    if (images.supportsLocation(photo)) hash = images.fingerprint(photo);
                }
                catch (ResponseStatusException exception) { hash = "error:" + exception.getReason(); }
                cells.put("profilePhotoUrl", new ExcelModel.Cell("", null, photo, hash, null));
            }
            cells.put("gradeName", ExcelModel.Cell.text(person.getGradeName()));
            cells.put("positionName", new ExcelModel.Cell(or(person.getPositionName(), "미지정"), "DBEAFE", null, null, null));
            cells.put("deptName", ExcelModel.Cell.text(person.getDeptName()));
            cells.put("employmentTypeName", ExcelModel.Cell.text(or(person.getEmploymentTypeName(), "-")));
            String date = person.getHireDate();
            cells.put("hireDate", ExcelModel.Cell.text(date == null || date.isEmpty() ? "-" : date.substring(0, Math.min(10, date.length()))));
            cells.put("serviceStatusName", new ExcelModel.Cell(or(person.getServiceStatusName(), "미지정"),
                    "101-010".equals(person.getServiceStatusCode()) ? "D1FAE5" : "F1F5F9", null, null, null));
            cells.put("detail", ExcelModel.Cell.text("상세보기"));
            cells.put("__personKey", ExcelModel.Cell.text(person.getPersonKey()));
            return new ExcelModel.Row(cells);
        }).toList();
        return new ExcelModel.Snapshot(COLUMNS, rows, page.getTotalElements());
    }
    private String or(String value, String fallback) { return value == null || value.isEmpty() ? fallback : value; }
}