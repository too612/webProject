package com.main.app.mypage.index;

import com.main.app.common.dto.ApiResponse;
import com.main.app.mypage.index.dto.MypageIndexDto;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestController
@RequestMapping("/api/mypage/index")
@RequiredArgsConstructor
public class MypageIndexController {

    private final MypageIndexService mypageIndexService;

    @GetMapping
    public ApiResponse<MypageIndexDto> getIndexData(
            HttpServletRequest request,
            @RequestParam(defaultValue = "LIVE") MypageIndexDto.Source mode) {
        String userId = getSessionUserId(request.getSession(false));
        if (userId == null || userId.isBlank()) {
            return ApiResponse.fail(401, "로그인이 필요합니다.");
        }
        return ApiResponse.ok(mypageIndexService.getIndexData(userId, mode));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> invalidMode() {
        return ApiResponse.fail(400, "데이터 원천은 LIVE 또는 DEMO여야 합니다.");
    }

    private String getSessionUserId(HttpSession session) {
        if (session == null) return null;
        Object userId = session.getAttribute("userId");
        return userId == null ? null : String.valueOf(userId);
    }
}
