package com.main.app.erp.admin.minutes;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.admin.minutes.dto.MinutesDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MinutesService {

    private final MinutesMapper adminMinutesMapper;

    public Page<MinutesDto.Minutes> getMinutesList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<MinutesDto.Minutes> list = adminMinutesMapper.selectMinutesList(keyword, offset, limit);
            long total = adminMinutesMapper.countMinutesList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}

