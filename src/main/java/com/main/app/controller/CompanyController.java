package com.main.app.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.ui.Model;
import com.main.app.model.CompanyInfo;

@Controller
@RequestMapping("/company")
public class CompanyController {
    
    @GetMapping("/ceo")
    public String getCeo(Model model) {
        CompanyInfo info = new CompanyInfo();
        info.setName("ABC Inc.");
        info.setAddress("123 Main St.");
        info.setCity("Anytown");
        info.setState("CA");
        info.setZip("12345");
        model.addAttribute("companyInfo", info);
        model.addAttribute("currentMenu", "회사소개");
        model.addAttribute("currentSubmenu", "CEO 인사말");
        return "company/ceo";
    }
    
    @GetMapping("/history")
    public String getHistory(Model model) {
        CompanyInfo history = new CompanyInfo();
        history.setName("ABC Inc.");
        history.setAddress("123 Main St.");
        history.setCity("Anytown");
        history.setState("CA");
        history.setZip("12345");
        model.addAttribute("companyHistory", history);
        model.addAttribute("currentMenu", "회사소개");
        model.addAttribute("currentSubmenu", "회사연혁");
        return "company/history";
    }

    @GetMapping("/mission")
    public String getMission(Model model) {
        model.addAttribute("currentMenu", "회사소개");
        model.addAttribute("currentSubmenu", "경영이념");
        return "company/mission";
    }
    
    @GetMapping("/location")
    public String getLocation(Model model) {
        CompanyInfo location = new CompanyInfo();
        location.setName("ABC Inc.");
        location.setAddress("123 Main St.");
        location.setCity("Anytown");
        location.setState("CA");
        location.setZip("12345");
        model.addAttribute("companyLocation", location);

        model.addAttribute("currentMenu", "회사소개");
        model.addAttribute("currentSubmenu", "오시는길");
        return "company/location";
    }
}