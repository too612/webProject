package com.main.app.erp.admin;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface AdminMapper {

    List<AdminDto.Certificate> selectCertificateList(@Param("keyword") String keyword,
                                                      @Param("offset") int offset,
                                                      @Param("limit") int limit);
    long countCertificateList(@Param("keyword") String keyword);

    List<AdminDto.Approval> selectApprovalList(@Param("keyword") String keyword,
                                                @Param("offset") int offset,
                                                @Param("limit") int limit);
    long countApprovalList(@Param("keyword") String keyword);

    List<AdminDto.Minutes> selectMinutesList(@Param("keyword") String keyword,
                                              @Param("offset") int offset,
                                              @Param("limit") int limit);
    long countMinutesList(@Param("keyword") String keyword);

    List<AdminDto.Archive> selectArchiveList(@Param("keyword") String keyword,
                                              @Param("offset") int offset,
                                              @Param("limit") int limit);
    long countArchiveList(@Param("keyword") String keyword);
}
