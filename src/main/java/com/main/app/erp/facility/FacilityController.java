package com.main.app.erp.facility;

import com.main.app.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController("erpFacilityController")
@RequestMapping("/api/erp/facility")
@RequiredArgsConstructor
public class FacilityController {

    private final FacilityService facilityService;

    @GetMapping("/reservation")
    public ApiResponse<Page<FacilityDto.Reservation>> reservation(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(facilityService.getReservationList(page, keyword));
    }

    @GetMapping("/vehicle")
    public ApiResponse<Page<FacilityDto.Vehicle>> vehicle(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(facilityService.getVehicleList(page, keyword));
    }

    @GetMapping("/inventory")
    public ApiResponse<Page<FacilityDto.Inventory>> inventory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(facilityService.getInventoryList(page, keyword));
    }

    @GetMapping("/maintenance")
    public ApiResponse<Page<FacilityDto.Maintenance>> maintenance(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(facilityService.getMaintenanceList(page, keyword));
    }
}
