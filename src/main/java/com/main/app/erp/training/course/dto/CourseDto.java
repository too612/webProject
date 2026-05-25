package com.main.app.erp.training.course.dto;

import lombok.Data;

public class CourseDto {

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
}
