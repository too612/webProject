package com.main.app.official.training.cellgroup;

import com.main.app.official.training.cellgroup.dto.CellGroupDto;
import com.main.app.official.training.cellgroup.dto.CellGroupGroupDto;
import com.main.app.official.training.cellgroup.dto.CellGroupMemberDto;
import com.main.app.official.training.cellgroup.dto.CellGroupRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CellGroupMapper {

    CellGroupDto selectCellGroup();

    List<CellGroupGroupDto> selectCellGroups(@Param("parentDeptCd") String parentDeptCd);

    List<CellGroupMemberDto> selectCellMembers(@Param("deptCode") String deptCode);

    int insertCellGroup(CellGroupRequest request);

    int updateCellGroup(@Param("id") Long id, @Param("request") CellGroupRequest request);

    int deleteCellGroup(@Param("id") Long id);
}