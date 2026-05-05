package com.main.app.erp.training;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("erpTrainingController")
@RequestMapping("/erp/training")
public class TrainingController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/course")
    public String coursePage(Model model) {
        addPageAttributes(model);
        return "erp/training/course";
    }
    @GetMapping("/student")
    public String studentPage(Model model) {
        addPageAttributes(model);
        return "erp/training/student";
    }
    @GetMapping("/attendance")
    public String attendancePage(Model model) {
        addPageAttributes(model);
        return "erp/training/attendance";
    }
    @GetMapping("/complete")
    public String completePage(Model model) {
        addPageAttributes(model);
        return "erp/training/complete";
    }
}
