package com.main.app.erp.humen.newcomer.dto;

import lombok.Data;

public class NewcomerDto {

    @Data
    public static class Newcomer {
        private String name;
        private String phone;
        private String visitDate;
        private String invitedBy;
        private String status;
    }
}
