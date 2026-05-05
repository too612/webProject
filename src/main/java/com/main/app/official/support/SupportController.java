package com.main.app.official.support;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("officialSupportController")
@RequestMapping("/support")
public class SupportController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/location")
    public String locationPage(Model model) {
        addPageAttributes(model);
        return "official/support/location";
    }
    @GetMapping("/qna")
    public String qnaPage(Model model) {
        addPageAttributes(model);
        return "official/support/qna";
    }
    @GetMapping("/faq")
    public String faqPage(Model model) {
        addPageAttributes(model);
        return "official/support/faq";
    }
}
