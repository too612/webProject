package com.main.app.system.index;

import org.apache.ibatis.annotations.Mapper;
import com.main.app.system.index.dto.SystemIndexDto;
import java.util.List;

@Mapper
public interface SystemIndexMapper {

    SystemIndexDto selectSummary();

    List<SystemIndexDto.MonthlyRegistration> selectMonthlyRegistrations();

    List<SystemIndexDto.Distribution> selectProgramStatus();

    List<SystemIndexDto.RoleCoverage> selectRoleCoverage();

    List<SystemIndexDto.RecentChange> selectRecentChanges();
}
