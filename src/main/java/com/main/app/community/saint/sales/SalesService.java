package com.main.app.community.saint.sales;

import com.main.app.common.util.PaginationUtil;
import com.main.app.community.saint.sales.dto.SalesDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalesService {

    private final SalesMapper salesMapper;

    public SalesService(SalesMapper salesMapper) {
        this.salesMapper = salesMapper;
    }

    public Page<SalesDto> getList(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        List<SalesDto> list = salesMapper.selectBoards(keyword, (int) pageable.getOffset(), pageable.getPageSize());
        long total = salesMapper.countBoards(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}