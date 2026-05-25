package com.main.app.erp.ministry.schedule;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.ministry.schedule.dto.ScheduleDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpMinistryScheduleService")
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleMapper scheduleMapper;

    public Page<ScheduleDto.Schedule> getScheduleList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<ScheduleDto.Schedule> list = scheduleMapper.selectScheduleList(keyword, offset, limit);
            long total = scheduleMapper.countScheduleList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
