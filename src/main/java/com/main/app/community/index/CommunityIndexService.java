package com.main.app.community.index;

import com.main.app.community.index.dto.CommunityIndexDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommunityIndexService {

    private final CommunityIndexMapper communityIndexMapper;

    @Transactional(readOnly = true)
    public CommunityIndexDto getIndexData() {
        CommunityIndexDto dto = new CommunityIndexDto();
        dto.setRecentPosts(communityIndexMapper.selectRecentPosts());
        dto.setNotices(communityIndexMapper.selectNotices());
        dto.setActivities(communityIndexMapper.selectActivities());

        CommunityIndexDto.Stats stats = new CommunityIndexDto.Stats();
        stats.setTotalMembers(communityIndexMapper.selectTotalMembers());
        stats.setTotalPosts(communityIndexMapper.selectTotalPosts());
        dto.setStats(stats);

        return dto;
    }
}
