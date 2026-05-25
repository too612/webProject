package com.main.app.erp.facility.vehicle;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.facility.vehicle.dto.VehicleDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpFacilityVehicleController")
@RequestMapping("/api/erp/facility/vehicle")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    public ApiResponse<Page<VehicleDto.Vehicle>> getVehicleList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(vehicleService.getVehicleList(page, keyword));
    }
}