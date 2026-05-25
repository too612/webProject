package com.main.app.system.index.dto;

import lombok.Data;

@Data
public class SystemIndexDto {

    private long activeAccounts;
    private long todayWarnings;
    private String backupSuccessRate;
    private long pendingRoleRequests;
}
