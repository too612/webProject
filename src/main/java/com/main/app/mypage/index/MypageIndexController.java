package com.main.app.mypage.index;

import com.main.app.common.dto.ApiResponse;
import com.main.app.mypage.index.dto.MypageIndexDto;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mypage/index")
@RequiredArgsConstructor
public class MypageIndexController {

    private final MypageIndexService mypageIndexService;

    @GetMapping
    public ApiResponse<MypageIndexDto> getIndexData(HttpSession session) {
        String userId = getSessionUserId(session);
        if (userId == null) {
            return ApiResponse.fail(401, "로그인이 필요합니다.");
        }
        return ApiResponse.ok(mypageIndexService.getIndexData(userId));
    }

    private String getSessionUserId(HttpSession session) {
        Object userId = session.getAttribute("userId");
        return userId == null ? null : String.valueOf(userId);
    }
}
