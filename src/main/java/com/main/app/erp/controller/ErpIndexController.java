package com.main.app.erp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/erp")
public class ErpIndexController {

    @GetMapping
    public String index(Model model) {
        model.addAttribute("pageTitle", "ERP");
        return "erp/index";
    }
}
