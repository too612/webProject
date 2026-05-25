package com.main.app.community.saint.pray;

import com.main.app.common.util.PaginationUtil;
import com.main.app.community.saint.pray.dto.PrayDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrayService {

    private final PrayMapper prayMapper;

    public PrayService(PrayMapper prayMapper) {
        this.prayMapper = prayMapper;
    }

    public Page<PrayDto> getList(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        List<PrayDto> list = prayMapper.selectBoards(keyword, (int) pageable.getOffset(), pageable.getPageSize());
        long total = prayMapper.countBoards(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}