package com.main.app.erp.ministry.volunteer;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.ministry.volunteer.dto.VolunteerDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpMinistryVolunteerService")
@RequiredArgsConstructor
public class VolunteerService {

    private final VolunteerMapper volunteerMapper;

    public Page<VolunteerDto.Volunteer> getVolunteerList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<VolunteerDto.Volunteer> list = volunteerMapper.selectVolunteerList(keyword, offset, limit);
            long total = volunteerMapper.countVolunteerList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
