package com.main.app.erp.sermon.attendance.dto;

import lombok.Data;

public class AttendanceDto {

    @Data
    public static class Attendance {
        private String attendanceId;
        private String worshipId;
        private String worshipTitle;
        private String memberId;
        private String memberName;
        private String attendDate;
        private String status;
    }
}
