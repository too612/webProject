package com.main.app.community.group;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("communityGroupController")
@RequestMapping("/community/group")
public class GroupController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/manager")
    public String managerPage(Model model) {
        addPageAttributes(model);
        return "community/group/manager";
    }
    @GetMapping("/groupa1")
    public String groupa1Page(Model model) {
        addPageAttributes(model);
        return "community/group/groupa1";
    }
    @GetMapping("/groupb2")
    public String groupb2Page(Model model) {
        addPageAttributes(model);
        return "community/group/groupb2";
    }
}