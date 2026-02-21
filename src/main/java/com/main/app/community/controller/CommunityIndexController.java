package com.main.app.community.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/community")
public class CommunityIndexController {

    @GetMapping
    public String index(Model model) {
        model.addAttribute("pageTitle", "커뮤니티");
        return "community/index";
    }
}
