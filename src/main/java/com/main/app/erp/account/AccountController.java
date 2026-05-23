package com.main.app.erp.account;

import com.main.app.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController("erpAccountController")
@RequestMapping("/api/erp/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping("/manager")
    public ApiResponse<Page<AccountDto.Offering>> manager(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(accountService.getOfferingList(page, keyword));
    }

    @GetMapping("/input")
    public ApiResponse<Page<AccountDto.Offering>> input(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(accountService.getInputList(page, keyword));
    }

    @GetMapping("/budget")
    public ApiResponse<Page<AccountDto.Budget>> budget(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Integer year) {
        return ApiResponse.ok(accountService.getBudgetList(page, year));
    }

    @GetMapping("/expense")
    public ApiResponse<Page<AccountDto.Expense>> expense(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(accountService.getExpenseList(page, keyword));
    }

    @GetMapping("/report")
    public ApiResponse<AccountDto.Report> report(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month) {
        return ApiResponse.ok(accountService.getReport(year, month));
    }
}
