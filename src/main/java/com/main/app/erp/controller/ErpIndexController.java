package com.main.app.erp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class ErpIndexController {

    @GetMapping("/erp")
    public String index(Model model) {
        model.addAttribute("pageTitle", "ERP");
        return "erp/index";
    }

    @GetMapping("/humen/{page}")
    public String humen(@PathVariable("page") String page, Model model) {
        model.addAttribute("pageTitle", "성도관리");
        return "erp/humen/" + page;
    }

    @GetMapping("/sermon/{page}")
    public String sermon(@PathVariable("page") String page, Model model) {
        model.addAttribute("pageTitle", "예배/설교관리");
        return "erp/sermon/" + page;
    }

    @GetMapping("/account/{page}")
    public String account(@PathVariable("page") String page, Model model) {
        model.addAttribute("pageTitle", "재정/헌금관리");
        return "erp/account/" + page;
    }

    @GetMapping("/training/{page}")
    public String training(@PathVariable("page") String page, Model model) {
        model.addAttribute("pageTitle", "교육/훈련관리");
        return "erp/training/" + page;
    }

    @GetMapping("/ministry/{page}")
    public String ministry(@PathVariable("page") String page, Model model) {
        model.addAttribute("pageTitle", "사역/조직관리");
        return "erp/ministry/" + page;
    }

    @GetMapping("/event/{page}")
    public String event(@PathVariable("page") String page, Model model) {
        model.addAttribute("pageTitle", "일정/행사관리");
        return "erp/event/" + page;
    }

    @GetMapping("/facility/{page}")
    public String facility(@PathVariable("page") String page, Model model) {
        model.addAttribute("pageTitle", "시설/자원관리");
        return "erp/facility/" + page;
    }

    @GetMapping("/comm/{page}")
    public String comm(@PathVariable("page") String page, Model model) {
        model.addAttribute("pageTitle", "커뮤니케이션");
        return "erp/comm/" + page;
    }

    @GetMapping("/stats/{page}")
    public String stats(@PathVariable("page") String page, Model model) {
        model.addAttribute("pageTitle", "통계/대시보드");
        return "erp/stats/" + page;
    }
}
