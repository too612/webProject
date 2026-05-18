package com.main.app.erp.sermon;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.main.app.common.dto.ApiResponse;
import java.util.Map;
import java.util.List;


@Controller("erpSermonController")
@RequestMapping("/erp/sermon")
public class SermonController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/write")
    public String writePage(Model model) {
        addPageAttributes(model);
        return "erp/sermon/write";
    }
    @GetMapping("/order")
    public String orderPage(Model model) {
        addPageAttributes(model);
        return "erp/sermon/order";
    }
    @GetMapping("/attendance")
    public String attendancePage(Model model) {
        addPageAttributes(model);
        return "erp/sermon/attendance";
    }
    @GetMapping("/archive")
    public String archivePage(Model model) {
        addPageAttributes(model);
        return "erp/sermon/archive";
    }

    @PostMapping("/api/sermon/save")
    @ResponseBody
    public ApiResponse<Map<String, Object>> saveSermonController(@RequestBody Map<String, Object> params) {
        return ApiResponse.ok(params);
    }

    @GetMapping("/api/sermon/list")
    @ResponseBody
    public ApiResponse<List<Map<String, Object>>> getSermonControllerList() {
        return ApiResponse.ok(null);
    }
}
