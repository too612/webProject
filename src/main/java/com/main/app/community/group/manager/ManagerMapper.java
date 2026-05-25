package com.main.app.community.group.manager;

import com.main.app.community.group.manager.dto.ManagerDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ManagerMapper {

    List<ManagerDto> selectBoards(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countBoards(@Param("keyword") String keyword);
}
