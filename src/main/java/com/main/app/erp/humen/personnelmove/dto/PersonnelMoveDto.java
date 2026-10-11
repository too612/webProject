package com.main.app.erp.humen.personnelmove.dto;

import java.time.LocalDate;
import java.util.List;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

public final class PersonnelMoveDto {
    private PersonnelMoveDto() {}

    @Data
    public static class Assignment {
        private String assignmentKey;
        private String personKey;
        private String employeeNo;
        private String nameKo;
        private String concurrentKey;
        private String scope = "main";
        private LocalDate assignmentDate;
        private Integer assignmentOrder;
        private String assignmentTypeCode;
        private String deptCd;
        private String gradeCode;
        private String positionCode;
        private String employmentTypeCode;
        private String jobTitleCode;
        private String assignmentContent;
        private LocalDate assignmentEndDate;
        private String dispatchCountryCode;
        private String remark;
        private Long version;
        private boolean historicalEdit;
        private String historicalReason;
        private boolean currentEffective;
        private boolean applied;
        private boolean pending;
        private boolean syncPaused;
    }

    @Data
    public static class ListQuery {
        private int page;
        private int size = 50;
        private String keyword;
        private String personKey;
        private String concurrentKey;
        private String scope = "main";
        private String deptCd;
        private String gradeCode;
        private String assignmentTypeCode;
        private String sort = "assignmentDate";
        private String direction = "desc";
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        private LocalDate assignmentDateFrom;
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        private LocalDate assignmentDateTo;
        private long offset;
        private int limit;
        private LocalDate today;
    }

    @Data
    public static class Person {
        private String personKey;
        private String concurrentKey;
        private String employeeNo;
        private String nameKo;
        private String deptCd;
        private String gradeCode;
        private String positionCode;
        private String employmentTypeCode;
        private String jobTitleCode;
        private String serviceStatusCode;
        private LocalDate retireDate;
        private String appliedAssignmentKey;
        private Long appliedAssignmentVersion;
        private long nextConcurrentNumber;
    }

    @Data
    public static class ConcurrentRequest {
        private String personKey;
    }

    public record CodeOption(String code, String codeName) {}
    public record Options(List<CodeOption> assignmentTypes, List<CodeOption> grades,
            List<CodeOption> positions, List<CodeOption> employmentTypes, List<CodeOption> jobTitles) {}
    public record Audit(String userId, String ip) {}
}
