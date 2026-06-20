package com.main.app.official.training.outreach;

import com.main.app.official.training.outreach.dto.OutreachDto;
import com.main.app.official.training.outreach.dto.OutreachRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface OutreachMapper {
    OutreachDto selectOutreach();
    int insertOutreach(OutreachRequest request);
    int updateOutreach(@Param("id") Long id, @Param("request") OutreachRequest request);
    int deleteOutreach(@Param("id") Long id);
}