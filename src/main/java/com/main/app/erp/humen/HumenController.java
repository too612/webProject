package com.main.app.erp.humen;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.main.app.common.dto.ApiResponse;
import java.util.Map;
import java.util.List;


@Controller("erpHumenController")
@RequestMapping("/erp/humen")
public class HumenController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/manager")
    public String managerPage(Model model) {
        addPageAttributes(model);
        return "erp/humen/manager";
    }
    @GetMapping("/newcomer")
    public String newcomerPage(Model model) {
        addPageAttributes(model);
        return "erp/humen/newcomer";
    }
    @GetMapping("/change")
    public String changePage(Model model) {
        addPageAttributes(model);
        return "erp/humen/change";
    }
    @GetMapping("/district")
    public String districtPage(Model model) {
        addPageAttributes(model);
        return "erp/humen/district";
    }

    @PostMapping("/api/humen/save")
    @ResponseBody
    public ApiResponse<Map<String, Object>> saveHumenController(@RequestBody Map<String, Object> params) {
        return ApiResponse.ok(params);
    }

    @GetMapping("/api/humen/list")
    @ResponseBody
    public ApiResponse<List<Map<String, Object>>> getHumenControllerList() {
        return ApiResponse.ok(null);
    }
}
