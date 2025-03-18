package com.main.app.controller;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/business")
public class BusinessController {
    
    @GetMapping("/fields")
    public String getFields(Model model) {
        model.addAttribute("currentMenu", "사업소개");
        model.addAttribute("currentSubmenu", "사업분야");
        return "business/fields";
    }
    

    @GetMapping("/system")
    public String getSystem(Model model) {
        model.addAttribute("currentMenu", "사업소개");
        model.addAttribute("currentSubmenu", "시스템소개");
        return "business/system";
    }
    
}