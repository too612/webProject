package com.main.app.erp.facility;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("erpFacilityController")
@RequestMapping("/erp/facility")
public class FacilityController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/reservation")
    public String reservationPage(Model model) {
        addPageAttributes(model);
        return "erp/facility/reservation";
    }
    @GetMapping("/vehicle")
    public String vehiclePage(Model model) {
        addPageAttributes(model);
        return "erp/facility/vehicle";
    }
    @GetMapping("/inventory")
    public String inventoryPage(Model model) {
        addPageAttributes(model);
        return "erp/facility/inventory";
    }
    @GetMapping("/maintenance")
    public String maintenancePage(Model model) {
        addPageAttributes(model);
        return "erp/facility/maintenance";
    }
}
