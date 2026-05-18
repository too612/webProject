package com.main.app.erp.training;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.main.app.common.dto.ApiResponse;
import java.util.Map;
import java.util.List;


@Controller("erpTrainingController")
@RequestMapping("/erp/training")
public class TrainingController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/course")
    public String coursePage(Model model) {
        addPageAttributes(model);
        return "erp/training/course";
    }
    @GetMapping("/student")
    public String studentPage(Model model) {
        addPageAttributes(model);
        return "erp/training/student";
    }
    @GetMapping("/attendance")
    public String attendancePage(Model model) {
        addPageAttributes(model);
        return "erp/training/attendance";
    }
    @GetMapping("/complete")
    public String completePage(Model model) {
        addPageAttributes(model);
        return "erp/training/complete";
    }

    @PostMapping("/api/training/save")
    @ResponseBody
    public ApiResponse<Map<String, Object>> saveTrainingController(@RequestBody Map<String, Object> params) {
        return ApiResponse.ok(params);
    }

    @GetMapping("/api/training/list")
    @ResponseBody
    public ApiResponse<List<Map<String, Object>>> getTrainingControllerList() {
        return ApiResponse.ok(null);
    }
}
