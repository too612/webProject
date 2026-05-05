package com.main.app.official.worship;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("officialWorshipController")
@RequestMapping("/worship")
public class WorshipController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/time")
    public String timePage(Model model) {
        addPageAttributes(model);
        return "official/worship/time";
    }
    @GetMapping("/live")
    public String livePage(Model model) {
        addPageAttributes(model);
        return "official/worship/live";
    }
    @GetMapping("/sermons")
    public String sermonsPage(Model model) {
        addPageAttributes(model);
        return "official/worship/sermons";
    }
}
