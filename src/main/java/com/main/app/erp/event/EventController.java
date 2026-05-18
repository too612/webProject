package com.main.app.erp.event;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.main.app.common.dto.ApiResponse;
import java.util.Map;
import java.util.List;


@Controller("erpEventController")
@RequestMapping("/erp/event")
public class EventController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/calendar")
    public String calendarPage(Model model) {
        addPageAttributes(model);
        return "erp/event/calendar";
    }
    @GetMapping("/apply")
    public String applyPage(Model model) {
        addPageAttributes(model);
        return "erp/event/apply";
    }
    @GetMapping("/participant")
    public String participantPage(Model model) {
        addPageAttributes(model);
        return "erp/event/participant";
    }
    @GetMapping("/result")
    public String resultPage(Model model) {
        addPageAttributes(model);
        return "erp/event/result";
    }

    @PostMapping("/api/event/save")
    @ResponseBody
    public ApiResponse<Map<String, Object>> saveEventController(@RequestBody Map<String, Object> params) {
        return ApiResponse.ok(params);
    }

    @GetMapping("/api/event/list")
    @ResponseBody
    public ApiResponse<List<Map<String, Object>>> getEventControllerList() {
        return ApiResponse.ok(null);
    }
}
