package com.main.app.erp.sermon.order.dto;

import lombok.Data;

public class OrderDto {

    @Data
    public static class Order {
        private String orderId;
        private String worshipId;
        private String worshipTitle;
        private String worshipDate;
        private int orderSeq;
        private String roleName;
        private String participant;
    }
}
