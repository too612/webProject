package com.main.app.erp.stats;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

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
}
