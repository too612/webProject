package com.main.app.mypage.user.notifications;

import com.main.app.common.auth.UserMapper;
import com.main.app.common.auth.dto.UserDto;
import com.main.app.mypage.user.notifications.dto.NotificationsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationsService {

    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public NotificationsDto getNotificationSettings(String userId) {
        UserDto user = userMapper.selectUserByUserId(userId);

        NotificationsDto settings = new NotificationsDto();
        settings.setEmail(true);
        settings.setSms(false);
        settings.setPush(true);
        settings.setNewsletter(user != null && Boolean.TRUE.equals(user.getAgreeMarketing()));
        return settings;
    }
}
