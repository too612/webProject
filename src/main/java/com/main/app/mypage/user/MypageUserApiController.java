package com.main.app.mypage.user;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.dto.ApiResponse;

@RestController
@RequestMapping("/api/mypage/user")
public class MypageUserApiController {

    @GetMapping("/profile")
    public ApiResponse<Map<String, Object>> getProfile() {
        return ApiResponse.ok(Map.of(
                "name", "",
                "email", "",
                "phone", "",
                "address", ""));
    }

    @GetMapping("/password")
    public ApiResponse<Map<String, Object>> getPasswordPolicy() {
        return ApiResponse.ok(Map.of(
                "minLength", 8,
                "requireSpecialChar", true,
                "requireNumber", true,
                "requireAlphabet", true));
    }

    @GetMapping("/activity")
    public ApiResponse<Map<String, Object>> getActivityList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size));
    }

    @GetMapping("/inquiry")
    public ApiResponse<Map<String, Object>> getInquiryList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size));
    }

    @GetMapping("/notifications")
    public ApiResponse<Map<String, Object>> getNotificationSettings() {
        return ApiResponse.ok(Map.of(
                "email", true,
                "sms", false,
                "push", true,
                "newsletter", true));
    }

    @GetMapping("/withdraw")
    public ApiResponse<Map<String, Object>> getWithdrawPolicy() {
        return ApiResponse.ok(Map.of(
                "allowed", true,
                "message", "회원 탈퇴 시 복구가 불가합니다."));
    }
}
