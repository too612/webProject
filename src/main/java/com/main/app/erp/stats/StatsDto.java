package com.main.app.erp.stats;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

public class StatsDto {

    @Data
    public static class Dashboard {
        private int totalMembers;
        private int newcomers;
        private int activeVolunteers;
        private int upcomingEvents;
        private BigDecimal monthlyIncome;
        private BigDecimal monthlyExpense;
        private int worshipCount;
        private int courseCount;
    }

    @Data
    public static class AttendanceStat {
        private String attendDate;
        private String worshipType;
        private int presentCount;
        private int absentCount;
        private int lateCount;
        private int totalCount;
    }

    @Data
    public static class OfferingStat {
        private String offeringDate;
        private String offeringType;
        private BigDecimal totalAmount;
        private int count;
    }

    @Data
    public static class MinistryStat {
        private String deptName;
        private int volunteerCount;
        private int scheduleCount;
        private int reportCount;
    }

    @Data
    public static class PagedResult<T> {
        private List<T> content;
        private int totalElements;
    }
}
