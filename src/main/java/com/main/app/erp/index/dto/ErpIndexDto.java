package com.main.app.erp.index.dto;

import lombok.Data;

import java.util.List;

@Data
public class ErpIndexDto {

    private long totalMembers;
    private long sermonPendingCount;
    private long accountRecordCount;
    private List<TaskItem> recentSermonTasks;

    @Data
    public static class TaskItem {
        private String id;
        private String title;
        private String status;
        private String date;
    }
}
