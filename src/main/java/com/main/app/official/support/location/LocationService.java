package com.main.app.official.support.location;

import com.main.app.official.support.location.dto.LocationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("officialSupportLocationService")
@RequiredArgsConstructor
public class LocationService {

    private final LocationMapper locationMapper;

    @Transactional(readOnly = true)
    public LocationDto getLocationInfo() {
        return locationMapper.selectLocationInfo();
    }
}
