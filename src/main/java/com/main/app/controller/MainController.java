package com.main.app.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.main.app.service.MainService;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class MainController {

    @Autowired
    private MainService mainService;
    
    @GetMapping("/")
    public String index(Model model, HttpServletRequest request) {
        
        List<Map<String,String>> list1 = mainService.getList1(request);
        model.addAttribute("newsList", list1);

        List<Map<String,String>> list2 = mainService.getList2(request);
        model.addAttribute("inquiryList", list2);

        return "index";
    }

    @GetMapping("/login")
    public String getLogin(Model model) {
        return "admin/login";
    }

    @GetMapping("/register")
    public String getRegister(Model model) {
        return "admin/register";
    }

    @GetMapping("/admin")
    public String getAdmin(Model model) {
        return "admin/admin";
    }
}
