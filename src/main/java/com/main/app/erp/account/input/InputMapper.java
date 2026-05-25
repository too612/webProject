package com.main.app.erp.account.input;

import com.main.app.erp.account.input.dto.InputDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface InputMapper {

    List<InputDto.Offering> selectInputList(@Param("keyword") String keyword,
                                                   @Param("offset") int offset,
                                                   @Param("limit") int limit);

    long countInputList(@Param("keyword") String keyword);
}

