package com.main.app.mypage.user.profile;

import com.main.app.common.dto.ApiResponse;
import com.main.app.mypage.user.profile.dto.ProfileDto;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mypage/user/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ApiResponse<?> getProfile(HttpSession session) {
        String userId = getSessionUserId(session);
        if (userId == null) {
            return ApiResponse.fail(401, "로그인이 필요합니다.");
        }

        ProfileDto profile = profileService.getProfile(userId);
        if (profile == null) {
            return ApiResponse.fail(404, "사용자 정보를 찾을 수 없습니다.");
        }
        return ApiResponse.ok(profile);
    }

    private String getSessionUserId(HttpSession session) {
        Object userId = session.getAttribute("userId");
        return userId == null ? null : String.valueOf(userId);
    }
}
