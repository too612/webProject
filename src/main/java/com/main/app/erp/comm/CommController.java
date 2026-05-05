package com.main.app.erp.comm;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

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
}
