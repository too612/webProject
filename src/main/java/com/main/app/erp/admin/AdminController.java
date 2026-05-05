package com.main.app.erp.admin;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("erpAdminController")
@RequestMapping("/erp/admin")
public class AdminController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/certificate")
    public String certificatePage(Model model) {
        addPageAttributes(model);
        return "erp/admin/certificate";
    }
    @GetMapping("/approval")
    public String approvalPage(Model model) {
        addPageAttributes(model);
        return "erp/admin/approval";
    }
    @GetMapping("/minutes")
    public String minutesPage(Model model) {
        addPageAttributes(model);
        return "erp/admin/minutes";
    }
    @GetMapping("/archive")
    public String archivePage(Model model) {
        addPageAttributes(model);
        return "erp/admin/archive";
    }
}
