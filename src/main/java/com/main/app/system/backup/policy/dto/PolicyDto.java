package com.main.app.system.backup.policy.dto;

import lombok.Data;

@Data
public class PolicyDto {
    private String policyId;
    private String target;
    private String schedule;
    private String retention;
    private String status;
    private String lastRun;
}