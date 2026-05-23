package com.main.app.erp.ministry;

import com.main.app.common.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service("erpMinistryService")
@RequiredArgsConstructor
public class MinistryService {

    private final MinistryMapper ministryMapper;

    public Page<MinistryDto.Department> getDepartmentList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<MinistryDto.Department> list = ministryMapper.selectDepartmentList(keyword, offset, limit);
        long total = ministryMapper.countDepartmentList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<MinistryDto.Schedule> getScheduleList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<MinistryDto.Schedule> list = ministryMapper.selectScheduleList(keyword, offset, limit);
        long total = ministryMapper.countScheduleList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<MinistryDto.Volunteer> getVolunteerList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<MinistryDto.Volunteer> list = ministryMapper.selectVolunteerList(keyword, offset, limit);
        long total = ministryMapper.countVolunteerList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<MinistryDto.Report> getReportList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<MinistryDto.Report> list = ministryMapper.selectReportList(keyword, offset, limit);
        long total = ministryMapper.countReportList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}
