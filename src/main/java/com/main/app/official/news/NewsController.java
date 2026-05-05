package com.main.app.official.news;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("officialNewsController")
@RequestMapping("/news")
public class NewsController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/announcement")
    public String announcementPage(Model model) {
        addPageAttributes(model);
        return "official/news/announcement";
    }
    @GetMapping("/event")
    public String eventPage(Model model) {
        addPageAttributes(model);
        return "official/news/event";
    }
    @GetMapping("/bulletin")
    public String bulletinPage(Model model) {
        addPageAttributes(model);
        return "official/news/bulletin";
    }
    @GetMapping("/registration")
    public String registrationPage(Model model) {
        addPageAttributes(model);
        return "official/news/registration";
    }
}
