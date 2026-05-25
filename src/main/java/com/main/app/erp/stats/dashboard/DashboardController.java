package com.main.app.erp.stats.dashboard;

import com.main.app.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController("erpStatsDashboardController")
@RequestMapping("/api/erp/stats/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ApiResponse<Map<String, Object>> dashboard() {
        return ApiResponse.ok(dashboardService.getDashboard());
    }
}
