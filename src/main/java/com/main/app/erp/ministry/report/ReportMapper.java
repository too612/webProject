package com.main.app.erp.ministry.report;

import com.main.app.erp.ministry.report.dto.ReportDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReportMapper {

    List<ReportDto.Report> selectReportList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countReportList(@Param("keyword") String keyword);
}
