package com.main.app.community.world;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("communityWorldController")
@RequestMapping("/community/world")
public class WorldController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/christian")
    public String christianPage(Model model) {
        addPageAttributes(model);
        return "community/world/christian";
    }
    @GetMapping("/economic")
    public String economicPage(Model model) {
        addPageAttributes(model);
        return "community/world/economic";
    }
    @GetMapping("/health")
    public String healthPage(Model model) {
        addPageAttributes(model);
        return "community/world/health";
    }
}