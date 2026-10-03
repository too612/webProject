package com.main.app.system.index.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class SystemIndexDto {

    private String source;
    private LocalDate asOf;
    private LocalDate periodStart;
    private long menuCount;
    private long routedMenuCount;
    private long programCount;
    private long activeProgramCount;
    private long roleCount;
    private long activeRoleCount;
    private long codeCount;
    private long activeCodeCount;
    private long periodCodeCount;
    private long periodProgramCount;
    private List<MonthlyRegistration> monthlyRegistrations;
    private List<Distribution> programStatus;
    private List<RoleCoverage> roleCoverage;
    private List<RecentChange> recentChanges;

    @Data
    public static class MonthlyRegistration {
        private String month;
        private long codeCount;
        private long programCount;
    }

    @Data
    public static class Distribution {
        private String label;
        private long count;
    }

    @Data
    public static class RoleCoverage {
        private String label;
        private long readCount;
        private long writeCount;
    }

    @Data
    public static class RecentChange {
        private String kind;
        private String label;
        private String changedAt;
    }
}
