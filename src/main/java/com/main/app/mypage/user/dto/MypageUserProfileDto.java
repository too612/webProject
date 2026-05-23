package com.main.app.mypage.user.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MypageUserProfileDto {
    private String userId;
    private String userName;
    private String email;
    private String phone;
    private String status;
    private LocalDateTime lastLoginDt;
}
