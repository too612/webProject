package com.main.app.official.about;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("officialAboutController")
@RequestMapping("/about")
public class AboutController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/pastor")
    public String pastorPage(Model model) {
        addPageAttributes(model);
        return "official/about/pastor";
    }
    @GetMapping("/vision")
    public String visionPage(Model model) {
        addPageAttributes(model);
        return "official/about/vision";
    }
    @GetMapping("/history")
    public String historyPage(Model model) {
        addPageAttributes(model);
        return "official/about/history";
    }
    @GetMapping("/beliefs")
    public String beliefsPage(Model model) {
        addPageAttributes(model);
        return "official/about/beliefs";
    }
}
