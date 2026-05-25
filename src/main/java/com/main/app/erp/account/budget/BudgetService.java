package com.main.app.erp.account.budget;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.account.budget.dto.BudgetDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetMapper accountBudgetMapper;

    public Page<BudgetDto.Budget> getBudgetList(int page, Integer year) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<BudgetDto.Budget> list = accountBudgetMapper.selectBudgetList(year, offset, limit);
            long total = accountBudgetMapper.countBudgetList(year);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
