package com.main.app.mypage.user.notifications.dto;

import lombok.Data;

@Data
public class NotificationsDto {
    private boolean email;
    private boolean sms;
    private boolean push;
    private boolean newsletter;
}
