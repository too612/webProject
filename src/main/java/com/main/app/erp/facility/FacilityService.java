package com.main.app.erp.facility;

import com.main.app.common.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service("erpFacilityService")
@RequiredArgsConstructor
public class FacilityService {

    private final FacilityMapper facilityMapper;

    public Page<FacilityDto.Reservation> getReservationList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<FacilityDto.Reservation> list = facilityMapper.selectReservationList(keyword, offset, limit);
        long total = facilityMapper.countReservationList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<FacilityDto.Vehicle> getVehicleList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<FacilityDto.Vehicle> list = facilityMapper.selectVehicleList(keyword, offset, limit);
        long total = facilityMapper.countVehicleList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<FacilityDto.Inventory> getInventoryList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<FacilityDto.Inventory> list = facilityMapper.selectInventoryList(keyword, offset, limit);
        long total = facilityMapper.countInventoryList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<FacilityDto.Maintenance> getMaintenanceList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<FacilityDto.Maintenance> list = facilityMapper.selectMaintenanceList(keyword, offset, limit);
        long total = facilityMapper.countMaintenanceList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}
