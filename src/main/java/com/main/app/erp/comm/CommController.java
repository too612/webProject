package com.main.app.erp.comm;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.main.app.common.dto.ApiResponse;
import java.util.Map;
import java.util.List;


@Controller("erpCommController")
@RequestMapping("/erp/comm")
public class CommController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/notice")
    public String noticePage(Model model) {
        addPageAttributes(model);
        return "erp/comm/notice";
    }
    @GetMapping("/message")
    public String messagePage(Model model) {
        addPageAttributes(model);
        return "erp/comm/message";
    }
    @GetMapping("/prayer")
    public String prayerPage(Model model) {
        addPageAttributes(model);
        return "erp/comm/prayer";
    }
    @GetMapping("/newsletter")
    public String newsletterPage(Model model) {
        addPageAttributes(model);
        return "erp/comm/newsletter";
    }

    @PostMapping("/api/comm/save")
    @ResponseBody
    public ApiResponse<Map<String, Object>> saveCommController(@RequestBody Map<String, Object> params) {
        return ApiResponse.ok(params);
    }

    @GetMapping("/api/comm/list")
    @ResponseBody
    public ApiResponse<List<Map<String, Object>>> getCommControllerList() {
        return ApiResponse.ok(null);
    }
}
