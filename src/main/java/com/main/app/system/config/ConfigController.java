package com.main.app.system.config;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("systemConfigController")
@RequestMapping("/system/config")
public class ConfigController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/code")
    public String codePage(Model model) {
        addPageAttributes(model);
        return "system/config/code";
    }
    @GetMapping("/menu")
    public String menuPage(Model model) {
        addPageAttributes(model);
        return "system/config/menu";
    }
}
