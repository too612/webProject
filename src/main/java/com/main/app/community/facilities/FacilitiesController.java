package com.main.app.community.facilities;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("communityFacilitiesController")
@RequestMapping("/community/facilities")
public class FacilitiesController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/calendar")
    public String calendarPage(Model model) {
        addPageAttributes(model);
        return "community/facilities/calendar";
    }
    @GetMapping("/dining")
    public String diningPage(Model model) {
        addPageAttributes(model);
        return "community/facilities/dining";
    }
    @GetMapping("/prayer")
    public String prayerPage(Model model) {
        addPageAttributes(model);
        return "community/facilities/prayer";
    }
}