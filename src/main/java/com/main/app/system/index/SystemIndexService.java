package com.main.app.system.index;

import com.main.app.system.index.dto.SystemIndexDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class SystemIndexService {

    private final SystemIndexMapper systemIndexMapper;

    @Transactional(readOnly = true)
    public SystemIndexDto getIndexData() {
        SystemIndexDto dto = new SystemIndexDto();
        dto.setActiveAccounts(systemIndexMapper.selectActiveAccounts());
        dto.setTodayWarnings(systemIndexMapper.selectTodayWarnings());
        dto.setPendingRoleRequests(systemIndexMapper.selectPendingRoleRequests());

        long backupTotal = systemIndexMapper.selectBackupHistoryCount();
        long backupSuccess = systemIndexMapper.selectBackupSuccessCount();
        String successRate = backupTotal == 0
                ? "0.0%"
                : String.format(Locale.ROOT, "%.1f%%", (backupSuccess * 100.0) / backupTotal);
        dto.setBackupSuccessRate(successRate);

        return dto;
    }
}
