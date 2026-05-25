package com.main.app.erp.humen.newcomer;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.humen.newcomer.dto.NewcomerDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpHumenNewcomerService")
@RequiredArgsConstructor
public class NewcomerService {

    private final NewcomerMapper newcomerMapper;

    public Page<NewcomerDto.Newcomer> getNewcomerList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<NewcomerDto.Newcomer> list = newcomerMapper.selectNewcomerList(keyword, offset, limit);
            long total = newcomerMapper.countNewcomerList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
