package com.main.app.erp.facility.inventory.dto;

import lombok.Data;

public class InventoryDto {

    @Data
    public static class Inventory {
        private String inventoryId;
        private String itemName;
        private String category;
        private int quantity;
        private String unit;
        private String location;
        private String status;
        private String regDate;
    }
}
