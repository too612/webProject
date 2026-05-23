package com.main.app.erp.training;

import lombok.Data;

public class TrainingDto {

    @Data
    public static class Course {
        private String courseId;
        private String courseName;
        private String instructor;
        private String startDate;
        private String endDate;
        private String description;
        private String status;
        private int studentCount;
        private String regDate;
    }

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
