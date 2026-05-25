package com.main.app.erp.stats.dashboard;

import com.main.app.erp.stats.dashboard.dto.DashboardDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service("erpStatsDashboardService")
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardMapper dashboardMapper;

    public Map<String, Object> getDashboard() {
        Map<String, Object> result = new HashMap<>();
        result.put("totalMembers", 0);
        result.put("newMembers", 0);
        result.put("avgAttendance", 0);
        result.put("totalOffering", BigDecimal.ZERO);

        try {
            DashboardDto.Summary summary = dashboardMapper.selectDashboard();
            if (summary != null) {
                result.put("totalMembers", summary.getTotalMembers());
                result.put("newMembers", summary.getNewMembers());
                result.put("avgAttendance", summary.getAvgAttendance());
                result.put("totalOffering",
                        summary.getTotalOffering() != null ? summary.getTotalOffering() : BigDecimal.ZERO);
            }
        } catch (Exception ignored) {
            // Keep default values to guarantee stable API response.
        }

        return result;
    }
}
