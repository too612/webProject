package com.main.app.erp.account.report;

import com.main.app.erp.account.report.dto.ReportDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportMapper accountReportMapper;

    public ReportDto.Report getReport(String year, String month) {
        try {
            ReportDto.Report report = accountReportMapper.selectReport(year, month);
            if (report == null) {
                report = new ReportDto.Report();
            }
            report.setItems(accountReportMapper.selectReportItems(year, month));
            return report;
        } catch (Exception e) {
            ReportDto.Report fallback = new ReportDto.Report();
            fallback.setIncome(BigDecimal.ZERO);
            fallback.setExpense(BigDecimal.ZERO);
            fallback.setBalance(BigDecimal.ZERO);
            fallback.setItems(Collections.emptyList());
            return fallback;
        }
    }
}
