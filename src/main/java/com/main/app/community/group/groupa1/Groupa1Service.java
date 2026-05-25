package com.main.app.community.group.groupa1;

import com.main.app.common.util.PaginationUtil;
import com.main.app.community.group.groupa1.dto.Groupa1Dto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("communityGroupGroupa1Service")
public class Groupa1Service {

    private final Groupa1Mapper groupa1Mapper;

    public Groupa1Service(Groupa1Mapper groupa1Mapper) {
        this.groupa1Mapper = groupa1Mapper;
    }

    public Page<Groupa1Dto> getList(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        List<Groupa1Dto> list = groupa1Mapper.selectBoards(keyword, (int) pageable.getOffset(), pageable.getPageSize());
        long total = groupa1Mapper.countBoards(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}
