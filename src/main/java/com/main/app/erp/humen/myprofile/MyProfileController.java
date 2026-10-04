package com.main.app.erp.humen.myprofile;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.humen.myprofile.dto.MyProfileDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController("erpHumenMyProfileController")
@RequestMapping("/api/erp/humen/myprofile")
@RequiredArgsConstructor
public class MyProfileController {

    private final MyProfileService myprofileService;

    @GetMapping
    public ApiResponse<MyProfileDto.Profile> getMyProfile(HttpServletRequest request) {
        String userId = getSessionUserId(request.getSession(false));
        if (userId == null || userId.isBlank()) {
            return ApiResponse.fail(401, "로그인이 필요합니다.");
        }
        return ApiResponse.ok(myprofileService.getMyProfile(userId));
    }

    @PutMapping
    public ApiResponse<Void> updateOwnContactInfo(
            HttpServletRequest request,
            @RequestBody MyProfileDto.ContactUpdate contact) {
        String userId = getSessionUserId(request.getSession(false));
        if (userId == null || userId.isBlank()) {
            return ApiResponse.fail(401, "로그인이 필요합니다.");
        }
        myprofileService.updateOwnContactInfo(userId, contact);
        return ApiResponse.ok(null, "내 정보가 저장되었습니다.");
    }

    private String getSessionUserId(HttpSession session) {
        if (session == null) {
            return null;
        }
        Object userId = session.getAttribute("userId");
        return userId == null ? null : String.valueOf(userId);
    }
}
