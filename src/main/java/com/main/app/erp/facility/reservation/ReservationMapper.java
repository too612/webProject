package com.main.app.erp.facility.reservation;

import com.main.app.erp.facility.reservation.dto.ReservationDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReservationMapper {

    List<ReservationDto.Reservation> selectReservationList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countReservationList(@Param("keyword") String keyword);
}