package com.main.app.community.index;

import com.main.app.community.index.dto.CommunityIndexDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;

@Service
@RequiredArgsConstructor
public class CommunityIndexService {

    private final CommunityIndexMapper communityIndexMapper;

    @Transactional(readOnly = true, isolation = Isolation.REPEATABLE_READ)
    public CommunityIndexDto getIndexData() {
        CommunityIndexDto dto = communityIndexMapper.selectMetadata();
        dto.setRecentPosts(communityIndexMapper.selectRecentPosts());
        dto.setMonthlyPosts(communityIndexMapper.selectMonthlyPosts());
        dto.setCategories(communityIndexMapper.selectCategories());
        dto.setStats(communityIndexMapper.selectStats());

        return dto;
    }
}
