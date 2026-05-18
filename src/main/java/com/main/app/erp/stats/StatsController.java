package com.main.app.erp.stats;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.main.app.common.dto.ApiResponse;
import java.util.Map;
import java.util.List;


@Controller("erpStatsController")
@RequestMapping("/erp/stats")
public class StatsController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/dashboard")
    public String dashboardPage(Model model) {
        addPageAttributes(model);
        return "erp/stats/dashboard";
    }
    @GetMapping("/attendance")
    public String attendancePage(Model model) {
        addPageAttributes(model);
        return "erp/stats/attendance";
    }
    @GetMapping("/offering")
    public String offeringPage(Model model) {
        addPageAttributes(model);
        return "erp/stats/offering";
    }
    @GetMapping("/ministry")
    public String ministryPage(Model model) {
        addPageAttributes(model);
        return "erp/stats/ministry";
    }

    @PostMapping("/api/stats/save")
    @ResponseBody
    public ApiResponse<Map<String, Object>> saveStatsController(@RequestBody Map<String, Object> params) {
        return ApiResponse.ok(params);
    }

    @GetMapping("/api/stats/list")
    @ResponseBody
    public ApiResponse<List<Map<String, Object>>> getStatsControllerList() {
        return ApiResponse.ok(null);
    }
}
