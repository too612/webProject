package com.main.app.erp.ministry.volunteer.dto;

import lombok.Data;

public class VolunteerDto {

    @Data
    public static class Volunteer {
        private String volunteerId;
        private String memberId;
        private String memberName;
        private String deptId;
        private String deptName;
        private String role;
        private String startDate;
        private String endDate;
        private String status;
    }
}
