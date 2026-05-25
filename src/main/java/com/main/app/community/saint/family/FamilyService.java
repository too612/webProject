package com.main.app.community.saint.family;

import com.main.app.common.util.PaginationUtil;
import com.main.app.community.saint.family.dto.FamilyDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FamilyService {

    private final FamilyMapper familyMapper;

    public FamilyService(FamilyMapper familyMapper) {
        this.familyMapper = familyMapper;
    }

    public Page<FamilyDto> getList(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        List<FamilyDto> list = familyMapper.selectBoards(keyword, (int) pageable.getOffset(), pageable.getPageSize());
        long total = familyMapper.countBoards(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}