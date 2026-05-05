package com.main.app.erp.event;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

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
}
