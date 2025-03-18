package com.main.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/product")
public class ProductController {
    
    @GetMapping("/systemA")
    public String getList1(Model model) {
        model.addAttribute("currentMenu", "제품소개");
        model.addAttribute("currentSubmenu", "시스템A");
        return "product/systemA";
    }
    
    @GetMapping("/systemB")
    public String getList2(Model model) {
        model.addAttribute("currentMenu", "제품소개");
        model.addAttribute("currentSubmenu", "시스템B");
        return "product/systemB";
    }
}