package com.main.app.mypage.user.notifications;

import com.main.app.common.dto.ApiResponse;
import com.main.app.mypage.user.notifications.dto.NotificationsDto;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mypage/user/notifications")
@RequiredArgsConstructor
public class NotificationsController {

    private final NotificationsService notificationsService;

    @GetMapping
    public ApiResponse<?> getNotificationSettings(HttpSession session) {
        String userId = getSessionUserId(session);
        if (userId == null) {
            return ApiResponse.fail(401, "로그인이 필요합니다.");
        }

        NotificationsDto settings = notificationsService.getNotificationSettings(userId);
        return ApiResponse.ok(settings);
    }

    private String getSessionUserId(HttpSession session) {
        Object userId = session.getAttribute("userId");
        return userId == null ? null : String.valueOf(userId);
    }
}
