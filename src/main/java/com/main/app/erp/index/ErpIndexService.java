package com.main.app.erp.index;

import com.main.app.erp.index.dto.ErpIndexDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ErpIndexService {

    private final ErpIndexMapper erpIndexMapper;

    @Transactional(readOnly = true)
    public ErpIndexDto getIndexData() {
        ErpIndexDto dto = new ErpIndexDto();
        dto.setTotalMembers(erpIndexMapper.selectTotalMembers());
        dto.setActiveMemberCount(erpIndexMapper.selectActiveMemberCount());
        dto.setNewMemberCount(erpIndexMapper.selectNewMemberCount());
        dto.setDepartmentCount(erpIndexMapper.selectDepartmentCount());
        dto.setMonthlyRegistrations(erpIndexMapper.selectMonthlyRegistrations());
        dto.setServiceStatusDistribution(erpIndexMapper.selectServiceStatusDistribution());
        dto.setEmploymentDistribution(erpIndexMapper.selectEmploymentDistribution());
        dto.setDepartmentStaff(erpIndexMapper.selectDepartmentStaff());
        return dto;
    }
}
