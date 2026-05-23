package com.main.app.erp.stats;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service("erpStatsService")
@RequiredArgsConstructor
public class StatsService {

    private final StatsMapper statsMapper;

    public Map<String, Object> getDashboard() {
        return statsMapper.selectDashboard();
    }

    public List<StatsDto.AttendanceStat> getAttendanceStats(String year, String month) {
        return statsMapper.selectAttendanceStats(year, month);
    }

    public List<StatsDto.OfferingStat> getOfferingStats(String year, String month) {
        return statsMapper.selectOfferingStats(year, month);
    }

    public List<StatsDto.MinistryStat> getMinistryStats(String year) {
        return statsMapper.selectMinistryStats(year);
    }
}
