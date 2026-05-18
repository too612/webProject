package com.main.app.erp.ministry;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.main.app.common.dto.ApiResponse;
import java.util.Map;
import java.util.List;


@Controller("erpMinistryController")
@RequestMapping("/erp/ministry")
public class MinistryController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/department")
    public String departmentPage(Model model) {
        addPageAttributes(model);
        return "erp/ministry/department";
    }
    @GetMapping("/volunteer")
    public String volunteerPage(Model model) {
        addPageAttributes(model);
        return "erp/ministry/volunteer";
    }
    @GetMapping("/schedule")
    public String schedulePage(Model model) {
        addPageAttributes(model);
        return "erp/ministry/schedule";
    }
    @GetMapping("/report")
    public String reportPage(Model model) {
        addPageAttributes(model);
        return "erp/ministry/report";
    }

    @PostMapping("/api/ministry/save")
    @ResponseBody
    public ApiResponse<Map<String, Object>> saveMinistryController(@RequestBody Map<String, Object> params) {
        return ApiResponse.ok(params);
    }

    @GetMapping("/api/ministry/list")
    @ResponseBody
    public ApiResponse<List<Map<String, Object>>> getMinistryControllerList() {
        return ApiResponse.ok(null);
    }
}
