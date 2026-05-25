package com.main.app.erp.admin.certificate;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.admin.certificate.dto.CertificateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateMapper adminCertificateMapper;

    public Page<CertificateDto.Certificate> getCertificateList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<CertificateDto.Certificate> list = adminCertificateMapper.selectCertificateList(keyword, offset, limit);
            long total = adminCertificateMapper.countCertificateList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}

