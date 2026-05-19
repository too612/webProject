package com.main.app.erp.account;

import org.springframework.web.bind.annotation.*;
import com.main.app.common.dto.ApiResponse;
import java.util.Map;
import java.util.List;

@RestController("erpAccountController")
@RequestMapping("/api/erp/account")
public class AccountController {

    @PostMapping("/save")
    public ApiResponse<Map<String, Object>> save(@RequestBody Map<String, Object> params) {
        return ApiResponse.ok(params);
    }

    @GetMapping("/api/account/list")
    @ResponseBody
    public ApiResponse<List<Map<String, Object>>> getAccountControllerList() {
        return ApiResponse.ok(null);
    }
}
