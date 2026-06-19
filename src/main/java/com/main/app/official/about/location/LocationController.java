package com.main.app.official.about.location;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.about.location.dto.LocationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/official/about/location")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @GetMapping
    public ApiResponse<LocationDto> getLocationInfo() {
        return ApiResponse.ok(locationService.getLocationInfo());
    }
}