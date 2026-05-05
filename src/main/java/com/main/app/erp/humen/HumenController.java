package com.main.app.erp.humen;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("erpHumenController")
@RequestMapping("/erp/humen")
public class HumenController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/manager")
    public String managerPage(Model model) {
        addPageAttributes(model);
        return "erp/humen/manager";
    }
    @GetMapping("/newcomer")
    public String newcomerPage(Model model) {
        addPageAttributes(model);
        return "erp/humen/newcomer";
    }
    @GetMapping("/change")
    public String changePage(Model model) {
        addPageAttributes(model);
        return "erp/humen/change";
    }
    @GetMapping("/district")
    public String districtPage(Model model) {
        addPageAttributes(model);
        return "erp/humen/district";
    }
}
