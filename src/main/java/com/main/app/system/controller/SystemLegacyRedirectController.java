package com.main.app.system.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class SystemLegacyRedirectController {

    @GetMapping("/user/{page:manager|role}")
    public String redirectUserLegacy(@PathVariable("page") String page) {
        return "redirect:/system/user/" + page;
    }

    @GetMapping("/config/{page:code|menu}")
    public String redirectConfigLegacy(@PathVariable("page") String page) {
        return "redirect:/system/config/" + page;
    }

    @GetMapping("/log/{page:system|audit}")
    public String redirectLogLegacy(@PathVariable("page") String page) {
        return "redirect:/system/log/" + page;
    }

    @GetMapping("/backup/{page:policy|history}")
    public String redirectBackupLegacy(@PathVariable("page") String page) {
        return "redirect:/system/backup/" + page;
    }
}
