package com.main.app.erp.account.report;

import com.main.app.erp.account.report.dto.ReportDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReportMapper {

    ReportDto.Report selectReport(@Param("year") String year, @Param("month") String month);

    List<ReportDto.Offering> selectReportItems(@Param("year") String year, @Param("month") String month);
}
