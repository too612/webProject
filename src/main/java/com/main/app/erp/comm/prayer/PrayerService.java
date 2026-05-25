package com.main.app.erp.comm.prayer;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.comm.prayer.dto.PrayerDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpCommPrayerService")
@RequiredArgsConstructor
public class PrayerService {

    private final PrayerMapper prayerMapper;

    public Page<PrayerDto.Prayer> getPrayerList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<PrayerDto.Prayer> list = prayerMapper.selectPrayerList(keyword, offset, limit);
            long total = prayerMapper.countPrayerList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
