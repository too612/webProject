package com.main.app.erp.humen.district;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.humen.district.dto.DistrictDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpHumenDistrictController")
@RequestMapping("/api/erp/humen/district")
@RequiredArgsConstructor
public class DistrictController {

    private final DistrictService districtService;

    @GetMapping
    public ApiResponse<Page<DistrictDto.District>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(districtService.getDistrictList(page, keyword));
    }
}
