package com.main.app.erp.ministry.report;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.ministry.report.dto.ReportDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpMinistryReportController")
@RequestMapping("/api/erp/ministry/report")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public ApiResponse<Page<ReportDto.Report>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(reportService.getReportList(page, keyword));
    }
}
