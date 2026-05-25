package com.main.app.mypage.user.profile;

import com.main.app.common.auth.UserMapper;
import com.main.app.common.auth.dto.UserDto;
import com.main.app.mypage.user.profile.dto.ProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public ProfileDto getProfile(String userId) {
        UserDto user = userMapper.selectUserByUserId(userId);
        if (user == null) {
            return null;
        }

        ProfileDto profile = new ProfileDto();
        profile.setUserId(user.getUserId());
        profile.setUserName(user.getUserName());
        profile.setEmail(user.getEmail());
        profile.setPhone(user.getPhone());
        profile.setStatus(user.getStatus());
        profile.setLastLoginDt(user.getLastLoginDt());
        return profile;
    }
}
