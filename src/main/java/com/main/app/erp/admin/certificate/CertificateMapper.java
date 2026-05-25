package com.main.app.erp.admin.certificate;

import com.main.app.erp.admin.certificate.dto.CertificateDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CertificateMapper {

    List<CertificateDto.Certificate> selectCertificateList(@Param("keyword") String keyword,
                                                                @Param("offset") int offset,
                                                                @Param("limit") int limit);

    long countCertificateList(@Param("keyword") String keyword);
}

