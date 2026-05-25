package com.main.app.mypage.user.withdraw;

import com.main.app.common.dto.ApiResponse;
import com.main.app.mypage.user.withdraw.dto.WithdrawPolicyDto;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mypage/user/withdraw")
@RequiredArgsConstructor
public class WithdrawController {

    private final WithdrawService withdrawService;

    @GetMapping
    public ApiResponse<?> getWithdrawPolicy(HttpSession session) {
        String userId = getSessionUserId(session);
        if (userId == null) {
            return ApiResponse.fail(401, "로그인이 필요합니다.");
        }

        WithdrawPolicyDto policy = withdrawService.getWithdrawPolicy(userId);
        return ApiResponse.ok(policy);
    }

    private String getSessionUserId(HttpSession session) {
        Object userId = session.getAttribute("userId");
        return userId == null ? null : String.valueOf(userId);
    }
}
