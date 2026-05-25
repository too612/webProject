package com.main.app.erp.facility.maintenance;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.facility.maintenance.dto.MaintenanceDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpFacilityMaintenanceService")
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceMapper maintenanceMapper;

    public Page<MaintenanceDto.Maintenance> getMaintenanceList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<MaintenanceDto.Maintenance> list = maintenanceMapper.selectMaintenanceList(keyword, offset, limit);
            long total = maintenanceMapper.countMaintenanceList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}