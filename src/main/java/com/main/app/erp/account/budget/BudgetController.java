package com.main.app.erp.account.budget;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.account.budget.dto.BudgetDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpBudgetController")
@RequestMapping("/api/erp/account/budget")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService accountBudgetService;

    @GetMapping
    public ApiResponse<Page<BudgetDto.Budget>> getBudgetList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Integer year) {
        return ApiResponse.ok(accountBudgetService.getBudgetList(page, year));
    }
}
