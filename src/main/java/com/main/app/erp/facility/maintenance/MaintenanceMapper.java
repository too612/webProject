package com.main.app.erp.facility.maintenance;

import com.main.app.erp.facility.maintenance.dto.MaintenanceDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MaintenanceMapper {

    List<MaintenanceDto.Maintenance> selectMaintenanceList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countMaintenanceList(@Param("keyword") String keyword);
}