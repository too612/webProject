package com.main.app.erp.admin.approval;

import com.main.app.erp.admin.approval.dto.ApprovalDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ApprovalMapper {

    List<ApprovalDto.Approval> selectApprovalList(@Param("keyword") String keyword,
                                                       @Param("offset") int offset,
                                                       @Param("limit") int limit);

    long countApprovalList(@Param("keyword") String keyword);
}

