package com.main.app.erp.ministry;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

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
}
