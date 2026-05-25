package com.main.app.erp.sermon.manager;

import com.main.app.erp.sermon.manager.dto.ManagerDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ManagerMapper {

    List<ManagerDto.Worship> selectManagerList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countManagerList(@Param("keyword") String keyword);
}
