package com.main.app.community.world.christian;

import com.main.app.common.util.PaginationUtil;
import com.main.app.community.world.christian.dto.ChristianDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChristianService {

    private final ChristianMapper christianMapper;

    public ChristianService(ChristianMapper christianMapper) {
        this.christianMapper = christianMapper;
    }

    public Page<ChristianDto> getList(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        List<ChristianDto> list = christianMapper.selectBoards(keyword, (int) pageable.getOffset(), pageable.getPageSize());
        long total = christianMapper.countBoards(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}