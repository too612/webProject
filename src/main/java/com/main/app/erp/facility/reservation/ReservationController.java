package com.main.app.erp.facility.reservation;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.facility.reservation.dto.ReservationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpFacilityReservationController")
@RequestMapping("/api/erp/facility/reservation")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public ApiResponse<Page<ReservationDto.Reservation>> getReservationList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(reservationService.getReservationList(page, keyword));
    }
}