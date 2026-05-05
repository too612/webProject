package com.main.app.system.log;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("systemLogController")
@RequestMapping("/system/log")
public class LogController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/system")
    public String systemPage(Model model) {
        addPageAttributes(model);
        return "system/log/system";
    }
    @GetMapping("/audit")
    public String auditPage(Model model) {
        addPageAttributes(model);
        return "system/log/audit";
    }
}
