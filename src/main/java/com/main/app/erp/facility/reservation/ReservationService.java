package com.main.app.erp.facility.reservation;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.facility.reservation.dto.ReservationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpFacilityReservationService")
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationMapper reservationMapper;

    public Page<ReservationDto.Reservation> getReservationList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<ReservationDto.Reservation> list = reservationMapper.selectReservationList(keyword, offset, limit);
            long total = reservationMapper.countReservationList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}