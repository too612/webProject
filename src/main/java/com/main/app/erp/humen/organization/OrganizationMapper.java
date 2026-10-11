package com.main.app.erp.humen.organization;

import com.main.app.erp.humen.organization.dto.OrganizationDto;
import com.main.app.erp.humen.organization.dto.OrganizationRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrganizationMapper {

    List<OrganizationDto.Reorg> selectReorgList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countReorgList(@Param("keyword") String keyword);

    int countReorgByDate(@Param("reorgDt") String reorgDt);

    String nextDepartmentCode();

    int nextSiblingSortOrder(@Param("reorgKey") String reorgKey,
            @Param("parentDeptKey") String parentDeptKey);

    OrganizationDto.ReorgDetail selectReorg(@Param("reorgKey") String reorgKey);

    String lockReorg(@Param("reorgKey") String reorgKey);

    String selectActiveReorgKey(@Param("baseDate") String baseDate);

    List<OrganizationDto.Department> selectDepartmentList(@Param("reorgKey") String reorgKey);

    List<OrganizationDto.DepartmentHistory> selectDepartmentHistory(@Param("reorgKey") String reorgKey);

    String insertReorg(@Param("request") OrganizationRequest.ReorgCreate request,
            @Param("regUser") String regUser);

    int cloneDepartments(@Param("sourceReorgKey") String sourceReorgKey,
            @Param("targetReorgKey") String targetReorgKey,
            @Param("regUser") String regUser);

    int insertDepartment(@Param("reorgKey") String reorgKey,
            @Param("request") OrganizationRequest.DepartmentCreate request,
            @Param("deptCd") String deptCd,
            @Param("deptLevel") int deptLevel,
            @Param("sortOrder") int sortOrder,
            @Param("regUser") String regUser);

    int updateDepartment(@Param("reorgKey") String reorgKey,
            @Param("deptKey") String deptKey,
            @Param("request") OrganizationRequest.DepartmentUpdate request,
            @Param("updUser") String updUser);

    int updateDepartmentParent(@Param("reorgKey") String reorgKey,
            @Param("deptKey") String deptKey,
            @Param("parentDeptKey") String parentDeptKey,
            @Param("deptLevel") int deptLevel,
            @Param("updUser") String updUser);

    int updateDepartmentPlacement(@Param("reorgKey") String reorgKey,
            @Param("deptKey") String deptKey,
            @Param("parentDeptKey") String parentDeptKey,
            @Param("deptLevel") int deptLevel,
            @Param("sortOrder") int sortOrder,
            @Param("updUser") String updUser);

    int updateDepartmentSortOrder(@Param("reorgKey") String reorgKey,
            @Param("deptKey") String deptKey,
            @Param("sortOrder") int sortOrder,
            @Param("updUser") String updUser);

    int updateDescendantLevels(@Param("reorgKey") String reorgKey,
            @Param("deptKey") String deptKey,
            @Param("levelDelta") int levelDelta,
            @Param("updUser") String updUser);

    int countActiveChildren(@Param("reorgKey") String reorgKey,
            @Param("deptKey") String deptKey);

    int deactivateDepartment(@Param("reorgKey") String reorgKey,
            @Param("deptKey") String deptKey,
            @Param("updUser") String updUser);

    int insertDepartmentHistory(@Param("reorgKey") String reorgKey,
            @Param("orgDeptKey") String orgDeptKey,
            @Param("chgDeptKey") String chgDeptKey,
            @Param("orgDeptCd") String orgDeptCd,
            @Param("orgDeptLevel") int orgDeptLevel,
            @Param("chgDeptCd") String chgDeptCd,
            @Param("chgDeptLevel") int chgDeptLevel,
            @Param("changeTypeCd") String changeTypeCd,
            @Param("changeNote") String changeNote,
            @Param("regUser") String regUser);

    int confirmReorg(@Param("reorgKey") String reorgKey, @Param("updUser") String updUser);
}
