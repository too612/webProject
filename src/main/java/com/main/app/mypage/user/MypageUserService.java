package com.main.app.mypage.user;

import com.main.app.common.auth.UserMapper;
import com.main.app.common.auth.dto.UserDto;
import com.main.app.common.util.PaginationUtil;
import com.main.app.mypage.user.dto.MypageUserCommentDto;
import com.main.app.mypage.user.dto.MypageUserPostDto;
import com.main.app.mypage.user.dto.MypageUserProfileDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class MypageUserService {

    private static final List<String> INQUIRY_BOARD_TYPES = List.of("COMMUNITY_QNA", "QNA");

    private final UserMapper userMapper;
    private final MypageUserMapper mypageUserMapper;

    public MypageUserService(UserMapper userMapper, MypageUserMapper mypageUserMapper) {
        this.userMapper = userMapper;
        this.mypageUserMapper = mypageUserMapper;
    }

    public MypageUserProfileDto getProfile(String userId) {
        UserDto user = userMapper.selectUserByUserId(userId);
        if (user == null) {
            return null;
        }

        MypageUserProfileDto profile = new MypageUserProfileDto();
        profile.setUserId(user.getUserId());
        profile.setUserName(user.getUserName());
        profile.setEmail(user.getEmail());
        profile.setPhone(user.getPhone());
        profile.setStatus(user.getStatus());
        profile.setLastLoginDt(user.getLastLoginDt());
        return profile;
    }

    public Map<String, Object> getPasswordPolicy() {
        Map<String, Object> policy = new LinkedHashMap<>();
        policy.put("minLength", 8);
        policy.put("requireSpecialChar", true);
        policy.put("requireNumber", true);
        policy.put("requireAlphabet", true);
        return policy;
    }

    public Page<MypageUserPostDto> getActivityList(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<MypageUserPostDto> list = mypageUserMapper.selectActivityList(userId, (int) pageable.getOffset(), pageable.getPageSize());
        long total = mypageUserMapper.countActivityList(userId);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<MypageUserPostDto> getInquiryList(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<MypageUserPostDto> list = mypageUserMapper.selectInquiryList(userId, INQUIRY_BOARD_TYPES, (int) pageable.getOffset(), pageable.getPageSize());
        long total = mypageUserMapper.countInquiryList(userId, INQUIRY_BOARD_TYPES);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<MypageUserCommentDto> getCommentList(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<MypageUserCommentDto> list = mypageUserMapper.selectCommentList(userId, (int) pageable.getOffset(), pageable.getPageSize());
        long total = mypageUserMapper.countCommentList(userId);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Map<String, Object> getNotificationSettings(String userId) {
        UserDto user = userMapper.selectUserByUserId(userId);
        Map<String, Object> settings = new LinkedHashMap<>();
        settings.put("email", true);
        settings.put("sms", false);
        settings.put("push", true);
        settings.put("newsletter", user != null && Boolean.TRUE.equals(user.getAgreeMarketing()));
        return settings;
    }

    public Map<String, Object> getWithdrawPolicy(String userId) {
        long activityCount = mypageUserMapper.countActivityList(userId);
        Map<String, Object> policy = new LinkedHashMap<>();
        policy.put("allowed", true);
        policy.put("message", "회원 탈퇴 후 복구가 불가능합니다.");
        policy.put("activityCount", activityCount);
        return policy;
    }
}
