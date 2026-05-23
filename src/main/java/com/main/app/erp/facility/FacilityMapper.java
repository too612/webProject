package com.main.app.erp.facility;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface FacilityMapper {

    List<FacilityDto.Reservation> selectReservationList(@Param("keyword") String keyword,
                                                         @Param("offset") int offset,
                                                         @Param("limit") int limit);
    long countReservationList(@Param("keyword") String keyword);

    List<FacilityDto.Vehicle> selectVehicleList(@Param("keyword") String keyword,
                                                 @Param("offset") int offset,
                                                 @Param("limit") int limit);
    long countVehicleList(@Param("keyword") String keyword);

    List<FacilityDto.Inventory> selectInventoryList(@Param("keyword") String keyword,
                                                     @Param("offset") int offset,
                                                     @Param("limit") int limit);
    long countInventoryList(@Param("keyword") String keyword);

    List<FacilityDto.Maintenance> selectMaintenanceList(@Param("keyword") String keyword,
                                                         @Param("offset") int offset,
                                                         @Param("limit") int limit);
    long countMaintenanceList(@Param("keyword") String keyword);
}

