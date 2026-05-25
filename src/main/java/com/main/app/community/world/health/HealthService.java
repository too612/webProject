package com.main.app.community.world.health;

import com.main.app.common.util.PaginationUtil;
import com.main.app.community.world.health.dto.HealthDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HealthService {

    private final HealthMapper healthMapper;

    public HealthService(HealthMapper healthMapper) {
        this.healthMapper = healthMapper;
    }

    public Page<HealthDto> getList(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        List<HealthDto> list = healthMapper.selectBoards(keyword, (int) pageable.getOffset(), pageable.getPageSize());
        long total = healthMapper.countBoards(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}