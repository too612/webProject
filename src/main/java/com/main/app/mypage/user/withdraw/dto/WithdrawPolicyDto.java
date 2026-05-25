package com.main.app.mypage.user.withdraw.dto;

import lombok.Data;

@Data
public class WithdrawPolicyDto {
    private boolean allowed;
    private String message;
    private long activityCount;
}
