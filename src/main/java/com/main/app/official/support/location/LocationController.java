package com.main.app.official.support.location;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.support.location.dto.LocationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/official/support/location")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @GetMapping
    public ApiResponse<LocationDto> getLocationInfo() {
        return ApiResponse.ok(locationService.getLocationInfo());
    }
}
