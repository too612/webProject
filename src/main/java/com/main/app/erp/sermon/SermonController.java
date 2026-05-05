package com.main.app.erp.sermon;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("erpSermonController")
@RequestMapping("/erp/sermon")
public class SermonController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/write")
    public String writePage(Model model) {
        addPageAttributes(model);
        return "erp/sermon/write";
    }
    @GetMapping("/order")
    public String orderPage(Model model) {
        addPageAttributes(model);
        return "erp/sermon/order";
    }
    @GetMapping("/attendance")
    public String attendancePage(Model model) {
        addPageAttributes(model);
        return "erp/sermon/attendance";
    }
    @GetMapping("/archive")
    public String archivePage(Model model) {
        addPageAttributes(model);
        return "erp/sermon/archive";
    }
}
