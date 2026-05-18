package com.main.app.erp.facility;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.main.app.common.dto.ApiResponse;
import java.util.Map;
import java.util.List;


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

    @PostMapping("/api/facility/save")
    @ResponseBody
    public ApiResponse<Map<String, Object>> saveFacilityController(@RequestBody Map<String, Object> params) {
        return ApiResponse.ok(params);
    }

    @GetMapping("/api/facility/list")
    @ResponseBody
    public ApiResponse<List<Map<String, Object>>> getFacilityControllerList() {
        return ApiResponse.ok(null);
    }
}
