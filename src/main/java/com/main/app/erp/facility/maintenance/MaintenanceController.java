package com.main.app.erp.facility.maintenance;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.facility.maintenance.dto.MaintenanceDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpFacilityMaintenanceController")
@RequestMapping("/api/erp/facility/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @GetMapping
    public ApiResponse<Page<MaintenanceDto.Maintenance>> getMaintenanceList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(maintenanceService.getMaintenanceList(page, keyword));
    }
}