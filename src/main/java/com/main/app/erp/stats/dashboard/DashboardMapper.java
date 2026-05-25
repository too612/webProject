package com.main.app.erp.stats.dashboard;

import com.main.app.erp.stats.dashboard.dto.DashboardDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DashboardMapper {

    DashboardDto.Summary selectDashboard();
}
