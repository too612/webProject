package com.main.app.erp.training.complete.dto;

import lombok.Data;

public class CompleteDto {

    @Data
    public static class Complete {
        private String studentId;
        private String courseId;
        private String courseName;
        private String memberId;
        private String memberName;
        private String enrollDate;
        private String completionDate;
        private String status;
    }
}
