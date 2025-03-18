package com.main.app.controller;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/performance")
public class PerformanceController {
    
    @GetMapping("/year2000")
    public String getList1(Model model) {
        model.addAttribute("currentMenu", "사업실적");
        model.addAttribute("currentSubmenu", "2000년");
        return "performance/year2000";
    }
    

    @GetMapping("/year2010")
    public String getList2(Model model) {
        model.addAttribute("currentMenu", "사업실적");
        model.addAttribute("currentSubmenu", "2010년");
        return "performance/year2010";
    }
    
}