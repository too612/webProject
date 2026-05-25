package com.main.app.mypage.user.password;

import com.main.app.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/mypage/user/password")
@RequiredArgsConstructor
public class PasswordController {

    private final PasswordService passwordService;

    @GetMapping
    public ApiResponse<Map<String, Object>> getPasswordPolicy() {
        return ApiResponse.ok(passwordService.getPasswordPolicy());
    }
}
