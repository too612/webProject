package com.main.app.erp.training.attendance.dto;

import lombok.Data;

public class AttendanceDto {

    @Data
    public static class Attendance {
        private String taId;
        private String courseId;
        private String courseName;
        private String memberId;
        private String memberName;
        private String attendDate;
        private String status;
    }
}
