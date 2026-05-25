package com.main.app.community.facilities.dining;

import com.main.app.common.util.PaginationUtil;
import com.main.app.community.facilities.dining.dto.DiningDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiningService {

    private final DiningMapper diningMapper;

    public DiningService(DiningMapper diningMapper) {
        this.diningMapper = diningMapper;
    }

    public Page<DiningDto> getDiningList(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        List<DiningDto> list = diningMapper.selectBoards(keyword, (int) pageable.getOffset(), pageable.getPageSize());
        long total = diningMapper.countBoards(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}