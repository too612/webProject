package com.main.app.erp.training.complete;

import com.main.app.erp.training.complete.dto.CompleteDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CompleteMapper {

    List<CompleteDto.Complete> selectCompleteList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countCompleteList(@Param("keyword") String keyword);
}
