package com.main.app.official.about.congregation;

import com.main.app.official.about.congregation.dto.CongregationDto;
import com.main.app.official.about.congregation.dto.CongregationRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CongregationMapper {

    CongregationDto selectCongregation();

    int insertCongregation(CongregationRequest request);

    int updateCongregation(@Param("id") Long id, @Param("request") CongregationRequest request);

    int deleteCongregation(@Param("id") Long id);
}
