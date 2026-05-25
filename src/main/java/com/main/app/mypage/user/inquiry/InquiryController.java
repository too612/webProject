package com.main.app.mypage.user.inquiry;

import com.main.app.common.dto.ApiResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/mypage/user/inquiry")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    @GetMapping
    public ApiResponse<Map<String, Object>> getInquiryList(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            HttpSession session) {
        String userId = getSessionUserId(session);
        if (userId == null) {
            return ApiResponse.fail(401, "로그인이 필요합니다.");
        }

        return ApiResponse.ok(inquiryService.getInquiryList(userId, page, size));
    }

    private String getSessionUserId(HttpSession session) {
        Object userId = session.getAttribute("userId");
        return userId == null ? null : String.valueOf(userId);
    }
}
