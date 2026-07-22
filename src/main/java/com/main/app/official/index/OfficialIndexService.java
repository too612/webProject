package com.main.app.official.index;

import com.main.app.official.index.dto.OfficialIndexDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OfficialIndexService {
    private final OfficialIndexMapper officialIndexMapper;

    @Transactional(readOnly = true)
    public OfficialIndexDto getIndexData() {
        OfficialIndexDto dto = new OfficialIndexDto();
        dto.setRecentAnnouncements(officialIndexMapper.selectRecentAnnouncements());
        dto.setSlideBanners(officialIndexMapper.selectSlideBanners());
        dto.setPopupBanners(officialIndexMapper.selectPopupBanners());
        dto.setRecentBulletins(officialIndexMapper.selectRecentBulletins());
        dto.setRecentGalleries(officialIndexMapper.selectRecentGalleries());
        return dto;
    }
}