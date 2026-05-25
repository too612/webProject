package com.main.app.erp.facility.vehicle;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.facility.vehicle.dto.VehicleDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpFacilityVehicleService")
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleMapper vehicleMapper;

    public Page<VehicleDto.Vehicle> getVehicleList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<VehicleDto.Vehicle> list = vehicleMapper.selectVehicleList(keyword, offset, limit);
            long total = vehicleMapper.countVehicleList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}