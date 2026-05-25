package com.main.app.erp.account.expense;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.account.expense.dto.ExpenseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpExpenseController")
@RequestMapping("/api/erp/account/expense")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService accountExpenseService;

    @GetMapping
    public ApiResponse<Page<ExpenseDto.Expense>> getExpenseList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(accountExpenseService.getExpenseList(page, keyword));
    }
}
