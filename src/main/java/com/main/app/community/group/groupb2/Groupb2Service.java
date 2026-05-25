package com.main.app.community.group.groupb2;

import com.main.app.common.util.PaginationUtil;
import com.main.app.community.group.groupb2.dto.Groupb2Dto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("communityGroupGroupb2Service")
public class Groupb2Service {

    private final Groupb2Mapper groupb2Mapper;

    public Groupb2Service(Groupb2Mapper groupb2Mapper) {
        this.groupb2Mapper = groupb2Mapper;
    }

    public Page<Groupb2Dto> getList(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        List<Groupb2Dto> list = groupb2Mapper.selectBoards(keyword, (int) pageable.getOffset(), pageable.getPageSize());
        long total = groupb2Mapper.countBoards(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}