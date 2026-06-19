package com.main.app.official.about.location;

import com.main.app.official.about.location.dto.LocationDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LocationMapper {

    LocationDto selectLocationInfo();
}