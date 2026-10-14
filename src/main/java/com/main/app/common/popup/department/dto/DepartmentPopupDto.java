package com.main.app.common.popup.department.dto;

import java.time.LocalDate;
import java.util.List;
import lombok.Data;

public final class DepartmentPopupDto {
    private DepartmentPopupDto() {}

    @Data
    public static class Reorganization {
        private String reorgKey;
        private LocalDate reorgDt;
        private String reorgTitle;
        private String confYn;
        private String useYn;
    }

    @Data
    public static class Department {
        private String deptKey;
        private String parentDeptKey;
        private String deptCd;
        private String deptNm;
        private boolean matched;
    }

    public record Result(Reorganization reorganization, List<Department> departments, long matchCount) {}
}
