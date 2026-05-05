package com.main.app.community.saint;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("communitySaintController")
@RequestMapping("/community/saint")
public class SaintController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/family")
    public String familyPage(Model model) {
        addPageAttributes(model);
        return "community/saint/family";
    }
    @GetMapping("/pray")
    public String prayPage(Model model) {
        addPageAttributes(model);
        return "community/saint/pray";
    }
    @GetMapping("/sales")
    public String salesPage(Model model) {
        addPageAttributes(model);
        return "community/saint/sales";
    }
    @GetMapping("/job")
    public String jobPage(Model model) {
        addPageAttributes(model);
        return "community/saint/job";
    }
}