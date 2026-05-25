package com.main.app.erp.event.apply;

import com.main.app.erp.event.apply.dto.ApplyDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ApplyMapper {

    List<ApplyDto.Apply> selectApplyList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countApplyList(@Param("keyword") String keyword);
}