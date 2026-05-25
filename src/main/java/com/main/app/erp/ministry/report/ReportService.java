package com.main.app.erp.ministry.report;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.ministry.report.dto.ReportDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpMinistryReportService")
@RequiredArgsConstructor
public class ReportService {

    private final ReportMapper reportMapper;

    public Page<ReportDto.Report> getReportList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<ReportDto.Report> list = reportMapper.selectReportList(keyword, offset, limit);
            long total = reportMapper.countReportList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
