package com.main.app.erp.humen.personnelmove;

import com.main.app.common.excel.ExcelDataProvider;
import com.main.app.common.excel.ExcelModel;
import com.main.app.common.excel.ExcelSnapshotStore;
import com.main.app.erp.humen.personnelmove.dto.PersonnelMoveDto;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Component
public class PersonnelMoveExcelDataProvider implements ExcelDataProvider<Page<PersonnelMoveDto.Assignment>> {
    private static final List<ExcelModel.Column> COLUMNS = List.of(
            new ExcelModel.Column("rowNumber", "NO", 72),
            new ExcelModel.Column("nameKo", "성명", 110),
            new ExcelModel.Column("employeeNo", "사번", 120),
            new ExcelModel.Column("assignmentDate", "발령일", 120),
            new ExcelModel.Column("assignmentOrder", "발령 순서", 95),
            new ExcelModel.Column("assignmentTypeCode", "발령 종류", 120),
            new ExcelModel.Column("deptCd", "부서 코드", 120),
            new ExcelModel.Column("gradeCode", "직급", 100),
            new ExcelModel.Column("positionCode", "직위", 100),
            new ExcelModel.Column("employmentTypeCode", "고용형태", 110),
            new ExcelModel.Column("jobTitleCode", "직책", 100),
            new ExcelModel.Column("applied", "반영 상태", 110),
            new ExcelModel.Column("detail", "상세", 90));
    private final PersonnelMoveService service;
    private final ExcelSnapshotStore snapshots;

    public PersonnelMoveExcelDataProvider(PersonnelMoveService service, ExcelSnapshotStore snapshots) {
        this.service = service;
        this.snapshots = snapshots;
    }

    public String issue(HttpSession session, PersonnelMoveDto.ListQuery query,
                        Page<PersonnelMoveDto.Assignment> page) {
        var saved = copy(query);
        return snapshots.issue(session, snapshot(page),
                () -> snapshot(service.getPersonnelMoveList(copy(saved))));
    }

    @Override
    public ExcelModel.Snapshot snapshot(Page<PersonnelMoveDto.Assignment> page) {
        var options = service.getOptions();
        var types = codes(options.assignmentTypes());
        var grades = codes(options.grades());
        var positions = codes(options.positions());
        var employment = codes(options.employmentTypes());
        var titles = codes(options.jobTitles());
        var rows = IntStream.range(0, page.getNumberOfElements()).mapToObj(index -> {
            var row = page.getContent().get(index);
            var cells = new LinkedHashMap<String, ExcelModel.Cell>();
            cells.put("rowNumber", ExcelModel.Cell.number((long) page.getNumber() * page.getSize() + index + 1));
            cells.put("nameKo", ExcelModel.Cell.text(row.getNameKo()));
            cells.put("employeeNo", ExcelModel.Cell.text(row.getEmployeeNo()));
            cells.put("assignmentDate", ExcelModel.Cell.text(String.valueOf(row.getAssignmentDate())));
            cells.put("assignmentOrder", ExcelModel.Cell.number(row.getAssignmentOrder()));
            cells.put("assignmentTypeCode", ExcelModel.Cell.text(label(types, row.getAssignmentTypeCode())));
            cells.put("deptCd", ExcelModel.Cell.text(row.getDeptCd()));
            cells.put("gradeCode", ExcelModel.Cell.text(label(grades, row.getGradeCode())));
            cells.put("positionCode", ExcelModel.Cell.text(label(positions, row.getPositionCode())));
            cells.put("employmentTypeCode", ExcelModel.Cell.text(label(employment, row.getEmploymentTypeCode())));
            cells.put("jobTitleCode", ExcelModel.Cell.text(label(titles, row.getJobTitleCode())));
            cells.put("applied", ExcelModel.Cell.text(status(row)));
            cells.put("detail", ExcelModel.Cell.text("상세보기"));
            cells.put("__assignmentKey", ExcelModel.Cell.text(row.getAssignmentKey()));
            cells.put("__version", ExcelModel.Cell.text(String.valueOf(row.getVersion())));
            return new ExcelModel.Row(cells);
        }).toList();
        return new ExcelModel.Snapshot(COLUMNS, rows, page.getTotalElements());
    }

    private static String status(PersonnelMoveDto.Assignment row) {
        if (row.isApplied()) return "반영";
        if (row.isCurrentEffective()) return row.isSyncPaused() ? "반영 보류" : "반영 대기";
        return row.isPending() ? "예정" : "과거 이력";
    }

    private static Map<String, String> codes(List<PersonnelMoveDto.CodeOption> options) {
        return options.stream().collect(Collectors.toMap(option -> Objects.requireNonNull(option).code(),
                option -> Objects.requireNonNull(option).codeName()));
    }

    private static String label(Map<String, String> codes, String code) {
        return code == null || code.isEmpty() ? "-" : codes.getOrDefault(code, code);
    }

    private static PersonnelMoveDto.ListQuery copy(PersonnelMoveDto.ListQuery source) {
        var copy = new PersonnelMoveDto.ListQuery();
        BeanUtils.copyProperties(source, copy);
        return copy;
    }
}
