package com.main.app.mypage.user;

import com.main.app.common.dto.ApiResponse;
import com.main.app.mypage.user.dto.MypageUserCommentDto;
import com.main.app.mypage.user.dto.MypageUserPostDto;
import com.main.app.mypage.user.dto.MypageUserProfileDto;
import jakarta.servlet.http.HttpSession;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mypage/user")
public class MypageUserController {

    private final MypageUserService mypageUserService;

    public MypageUserController(MypageUserService mypageUserService) {
        this.mypageUserService = mypageUserService;
    }

    @GetMapping("/profile")
    public ApiResponse<?> getProfile(HttpSession session) {
        String userId = getSessionUserId(session);
        if (userId == null) {
            return ApiResponse.fail(401, "로그인이 필요합니다.");
        }

        MypageUserProfileDto profile = mypageUserService.getProfile(userId);
        if (profile == null) {
            return ApiResponse.fail(404, "사용자 정보를 찾을 수 없습니다.");
        }
        return ApiResponse.ok(profile);
    }

    @GetMapping("/password")
    public ApiResponse<Map<String, Object>> getPasswordPolicy() {
        return ApiResponse.ok(mypageUserService.getPasswordPolicy());
    }

    @GetMapping("/activity")
    public ApiResponse<?> getActivityList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpSession session) {
        String userId = getSessionUserId(session);
        if (userId == null) {
            return ApiResponse.fail(401, "로그인이 필요합니다.");
        }

        Page<MypageUserPostDto> activity = mypageUserService.getActivityList(userId, page, size);
        return ApiResponse.ok(toPagePayload(activity));
    }

    @GetMapping("/inquiry")
    public ApiResponse<?> getInquiryList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpSession session) {
        String userId = getSessionUserId(session);
        if (userId == null) {
            return ApiResponse.fail(401, "로그인이 필요합니다.");
        }

        Page<MypageUserPostDto> inquiry = mypageUserService.getInquiryList(userId, page, size);
        return ApiResponse.ok(toPagePayload(inquiry));
    }

    @GetMapping("/comments")
    public ApiResponse<?> getCommentList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpSession session) {
        String userId = getSessionUserId(session);
        if (userId == null) {
            return ApiResponse.fail(401, "로그인이 필요합니다.");
        }

        Page<MypageUserCommentDto> comments = mypageUserService.getCommentList(userId, page, size);
        return ApiResponse.ok(Map.of(
                "content", comments.getContent(),
                "totalElements", comments.getTotalElements(),
                "totalPages", comments.getTotalPages(),
                "number", comments.getNumber(),
                "size", comments.getSize()));
    }

    @GetMapping("/notifications")
    public ApiResponse<?> getNotificationSettings(HttpSession session) {
        String userId = getSessionUserId(session);
        if (userId == null) {
            return ApiResponse.fail(401, "로그인이 필요합니다.");
        }

        return ApiResponse.ok(mypageUserService.getNotificationSettings(userId));
    }

    @GetMapping("/withdraw")
    public ApiResponse<?> getWithdrawPolicy(HttpSession session) {
        String userId = getSessionUserId(session);
        if (userId == null) {
            return ApiResponse.fail(401, "로그인이 필요합니다.");
        }

        return ApiResponse.ok(mypageUserService.getWithdrawPolicy(userId));
    }

    private String getSessionUserId(HttpSession session) {
        Object userId = session.getAttribute("userId");
        return userId == null ? null : String.valueOf(userId);
    }

    private Map<String, Object> toPagePayload(Page<MypageUserPostDto> page) {
        return Map.of(
                "content", page.getContent(),
                "totalElements", page.getTotalElements(),
                "totalPages", page.getTotalPages(),
                "number", page.getNumber(),
                "size", page.getSize());
    }
}
