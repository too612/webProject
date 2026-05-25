package com.main.app.mypage.index;

import com.main.app.mypage.index.dto.MypageIndexDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MypageIndexService {

    private final MypageIndexMapper mypageIndexMapper;

    @Transactional(readOnly = true)
    public MypageIndexDto getIndexData(String userId) {
        MypageIndexDto dto = new MypageIndexDto();
        dto.setActivityCount(mypageIndexMapper.selectActivityCount(userId));
        dto.setInquiryCount(mypageIndexMapper.selectInquiryCount(userId));
        dto.setNotificationCount(mypageIndexMapper.selectNotificationCount(userId));
        dto.setRecentActivities(mypageIndexMapper.selectRecentActivities(userId));
        return dto;
    }
}
