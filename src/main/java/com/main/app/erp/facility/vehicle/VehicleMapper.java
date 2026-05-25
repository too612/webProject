package com.main.app.erp.facility.vehicle;

import com.main.app.erp.facility.vehicle.dto.VehicleDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface VehicleMapper {

    List<VehicleDto.Vehicle> selectVehicleList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countVehicleList(@Param("keyword") String keyword);
}