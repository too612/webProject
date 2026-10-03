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
    public MypageIndexDto getIndexData(String userId, MypageIndexDto.Source source) {
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("Authenticated user is required");
        }
        MypageIndexDto dto = mypageIndexMapper.selectMetadata(source);
        if (source == MypageIndexDto.Source.DEMO) {
            dto.setStats(mypageIndexMapper.selectDemoStats());
            dto.setMonthlyActivities(mypageIndexMapper.selectDemoMonthlyActivities());
            dto.setCategories(mypageIndexMapper.selectDemoCategories());
            dto.setRecentActivities(mypageIndexMapper.selectDemoRecentActivities());
        } else {
            dto.setStats(mypageIndexMapper.selectStats(userId));
            dto.setMonthlyActivities(mypageIndexMapper.selectMonthlyActivities(userId));
            dto.setCategories(mypageIndexMapper.selectCategories(userId));
            dto.setRecentActivities(mypageIndexMapper.selectRecentActivities(userId));
        }
        return dto;
    }
}
