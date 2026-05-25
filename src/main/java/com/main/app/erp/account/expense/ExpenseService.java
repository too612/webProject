package com.main.app.erp.account.expense;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.account.expense.dto.ExpenseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseMapper accountExpenseMapper;

    public Page<ExpenseDto.Expense> getExpenseList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<ExpenseDto.Expense> list = accountExpenseMapper.selectExpenseList(keyword, offset, limit);
            long total = accountExpenseMapper.countExpenseList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
