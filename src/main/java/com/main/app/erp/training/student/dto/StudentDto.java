package com.main.app.erp.training.student.dto;

import lombok.Data;

public class StudentDto {

    @Data
    public static class Student {
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
