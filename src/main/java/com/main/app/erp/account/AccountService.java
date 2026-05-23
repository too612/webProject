package com.main.app.erp.account;

import com.main.app.common.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service("erpAccountService")
@RequiredArgsConstructor
public class AccountService {

    private final AccountMapper accountMapper;

    public Page<AccountDto.Offering> getOfferingList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<AccountDto.Offering> list = accountMapper.selectOfferingList(keyword, offset, limit);
        long total = accountMapper.countOfferingList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<AccountDto.Offering> getInputList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<AccountDto.Offering> list = accountMapper.selectInputList(keyword, offset, limit);
        long total = accountMapper.countInputList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<AccountDto.Budget> getBudgetList(int page, Integer year) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<AccountDto.Budget> list = accountMapper.selectBudgetList(year, offset, limit);
        long total = accountMapper.countBudgetList(year);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<AccountDto.Expense> getExpenseList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<AccountDto.Expense> list = accountMapper.selectExpenseList(keyword, offset, limit);
        long total = accountMapper.countExpenseList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public AccountDto.Report getReport(String year, String month) {
        AccountDto.Report report = accountMapper.selectReport(year, month);
        if (report == null) report = new AccountDto.Report();
        report.setItems(accountMapper.selectReportItems(year, month));
        return report;
    }
}
