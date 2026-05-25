package com.main.app.erp.account.report;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.account.report.dto.ReportDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpReportController")
@RequestMapping("/api/erp/account/report")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService accountReportService;

    @GetMapping
    public ApiResponse<ReportDto.Report> getReport(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month) {
        return ApiResponse.ok(accountReportService.getReport(year, month));
    }
}
