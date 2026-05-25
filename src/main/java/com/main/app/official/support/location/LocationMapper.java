package com.main.app.official.support.location;

import com.main.app.official.support.location.dto.LocationDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LocationMapper {

    LocationDto selectLocationInfo();
}
