package com.main.app.system.user;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("systemUserController")
@RequestMapping("/system/user")
public class UserController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/manager")
    public String managerPage(Model model) {
        addPageAttributes(model);
        return "system/user/manager";
    }
    @GetMapping("/role")
    public String rolePage(Model model) {
        addPageAttributes(model);
        return "system/user/role";
    }
}
