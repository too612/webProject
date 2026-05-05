package com.main.app.official.ministries;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("officialMinistriesController")
@RequestMapping("/ministries")
public class MinistriesController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/children")
    public String childrenPage(Model model) {
        addPageAttributes(model);
        return "official/ministries/children";
    }
    @GetMapping("/youth")
    public String youthPage(Model model) {
        addPageAttributes(model);
        return "official/ministries/youth";
    }
    @GetMapping("/mission")
    public String missionPage(Model model) {
        addPageAttributes(model);
        return "official/ministries/mission";
    }
}
