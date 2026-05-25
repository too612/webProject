package com.main.app.erp.stats.ministry;

import com.main.app.erp.stats.ministry.dto.MinistryDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MinistryMapper {

    List<MinistryDto.MinistryStat> selectMinistryStats(@Param("year") String year);
}