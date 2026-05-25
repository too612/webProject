package com.main.app.erp.humen.change.dto;

import lombok.Data;

public class ChangeDto {

    @Data
    public static class Change {
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
