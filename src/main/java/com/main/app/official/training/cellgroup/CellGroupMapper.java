package com.main.app.official.training.cellgroup;

import com.main.app.official.training.cellgroup.dto.CellGroupDto;
import com.main.app.official.training.cellgroup.dto.CellGroupRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CellGroupMapper {

    CellGroupDto selectCellGroup();

    int insertCellGroup(CellGroupRequest request);

    int updateCellGroup(@Param("id") Long id, @Param("request") CellGroupRequest request);

    int deleteCellGroup(@Param("id") Long id);
}