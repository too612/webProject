package com.main.app.erp.event.result;

import com.main.app.erp.event.result.dto.ResultDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ResultMapper {

    List<ResultDto.Event> selectResultList(@Param("keyword") String keyword,
                                           @Param("offset") int offset,
                                           @Param("limit") int limit);

    long countResultList(@Param("keyword") String keyword);
}