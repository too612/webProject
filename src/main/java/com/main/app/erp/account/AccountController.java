package com.main.app.erp.account;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.main.app.common.dto.ApiResponse;
import java.util.Map;
import java.util.List;


@Controller("erpAccountController")
@RequestMapping("/erp/account")
public class AccountController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/manager")
    public String managerPage(Model model) {
        addPageAttributes(model);
        return "erp/account/manager";
    }
    @GetMapping("/input")
    public String inputPage(Model model) {
        addPageAttributes(model);
        return "erp/account/input";
    }
    @GetMapping("/budget")
    public String budgetPage(Model model) {
        addPageAttributes(model);
        return "erp/account/budget";
    }
    @GetMapping("/expense")
    public String expensePage(Model model) {
        addPageAttributes(model);
        return "erp/account/expense";
    }
    @GetMapping("/report")
    public String reportPage(Model model) {
        addPageAttributes(model);
        return "erp/account/report";
    }

    @PostMapping("/api/account/save")
    @ResponseBody
    public ApiResponse<Map<String, Object>> saveAccountController(@RequestBody Map<String, Object> params) {
        return ApiResponse.ok(params);
    }

    @GetMapping("/api/account/list")
    @ResponseBody
    public ApiResponse<List<Map<String, Object>>> getAccountControllerList() {
        return ApiResponse.ok(null);
    }
}
