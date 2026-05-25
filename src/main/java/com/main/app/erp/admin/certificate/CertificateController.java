package com.main.app.erp.admin.certificate;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.admin.certificate.dto.CertificateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpCertificateController")
@RequestMapping("/api/erp/admin/certificate")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService adminCertificateService;

    @GetMapping
    public ApiResponse<Page<CertificateDto.Certificate>> getCertificateList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(adminCertificateService.getCertificateList(page, keyword));
    }
}

