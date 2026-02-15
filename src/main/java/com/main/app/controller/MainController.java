package com.main.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class MainController {

    //@Autowired
    //private MenuService menuService;
    
    @GetMapping("/")
    public String index(Model model, HttpServletRequest request) {
        
        //List<Map<String,String>> list1 = menuService.getList1(request);
        //model.addAttribute("newsList", list1);

        //List<Map<String,String>> list2 = menuService.getList2(request);
        //model.addAttribute("inquiryList", list2);

        return "index";
    }

    @GetMapping("/admin")
    public String getAdmin(Model model) {
        return "admin/admin";
    }
}
