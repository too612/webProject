package com.main.app.community.world;

import com.main.app.common.util.PaginationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("communityWorldService")
public class WorldService {

    private static final String WORLD_CHRISTIAN = "COMMUNITY_WORLD_CHRISTIAN";
    private static final String WORLD_ECONOMIC = "COMMUNITY_WORLD_ECONOMIC";
    private static final String WORLD_HEALTH = "COMMUNITY_WORLD_HEALTH";

    private final WorldMapper worldMapper;

    public WorldService(WorldMapper worldMapper) {
        this.worldMapper = worldMapper;
    }

    public Page<WorldDto> getChristianNews(int page, int size, String keyword) {
        return getPaged(page, size, keyword, WORLD_CHRISTIAN);
    }

    public Page<WorldDto> getEconomicNews(int page, int size, String keyword) {
        return getPaged(page, size, keyword, WORLD_ECONOMIC);
    }

    public Page<WorldDto> getHealthNews(int page, int size, String keyword) {
        return getPaged(page, size, keyword, WORLD_HEALTH);
    }

    private Page<WorldDto> getPaged(int page, int size, String keyword, String boardType) {
        Pageable pageable = PageRequest.of(page, size);
        List<WorldDto> list = worldMapper.selectBoards(boardType, keyword, (int) pageable.getOffset(),
                pageable.getPageSize());
        long total = worldMapper.countBoards(boardType, keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}
