package com.main.app.erp.humen.manager;

import com.main.app.erp.humen.manager.dto.ManagerDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ManagerMapper {

    List<ManagerDto.Member> selectMemberList(@Param("keyword") String keyword,
                                             @Param("offset") int offset,
                                             @Param("limit") int limit);

    long countMemberList(@Param("keyword") String keyword);
}
