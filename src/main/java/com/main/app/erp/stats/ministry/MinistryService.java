package com.main.app.erp.stats.ministry;

import com.main.app.erp.stats.ministry.dto.MinistryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpStatsMinistryService")
@RequiredArgsConstructor
public class MinistryService {

    private final MinistryMapper ministryMapper;

    public List<MinistryDto.MinistryStat> getMinistryStats(String year) {
        try {
            return ministryMapper.selectMinistryStats(year);
        } catch (Exception ignored) {
            return Collections.emptyList();
        }
    }
}