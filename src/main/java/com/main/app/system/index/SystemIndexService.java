package com.main.app.system.index;

import com.main.app.system.index.dto.SystemIndexDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;

@Service
@RequiredArgsConstructor
public class SystemIndexService {

    private final SystemIndexMapper systemIndexMapper;

    @Transactional(readOnly = true, isolation = Isolation.REPEATABLE_READ)
    public SystemIndexDto getIndexData() {
        SystemIndexDto dto = systemIndexMapper.selectSummary();
        dto.setMonthlyRegistrations(systemIndexMapper.selectMonthlyRegistrations());
        dto.setProgramStatus(systemIndexMapper.selectProgramStatus());
        dto.setRoleCoverage(systemIndexMapper.selectRoleCoverage());
        dto.setRecentChanges(systemIndexMapper.selectRecentChanges());
        return dto;
    }
}
