package com.main.app.system.backup;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("systemBackupController")
@RequestMapping("/system/backup")
public class BackupController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/policy")
    public String policyPage(Model model) {
        addPageAttributes(model);
        return "system/backup/policy";
    }
    @GetMapping("/history")
    public String historyPage(Model model) {
        addPageAttributes(model);
        return "system/backup/history";
    }
}
