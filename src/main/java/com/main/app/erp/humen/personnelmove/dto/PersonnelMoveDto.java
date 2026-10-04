package com.main.app.erp.humen.personnelmove.dto;

import lombok.Data;

public class PersonnelMoveDto {

    @Data
    public static class PersonnelMove {
        private String changeId;
        private String name;
        private String changeType;
        private String changeDate;
        private String prevStatus;
        private String newStatus;
        private String reason;
        private String registeredAt;
    }
}
