package com.main.app.erp.admin.minutes;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.admin.minutes.dto.MinutesDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpMinutesController")
@RequestMapping("/api/erp/admin/minutes")
@RequiredArgsConstructor
public class MinutesController {

    private final MinutesService adminMinutesService;

    @GetMapping
    public ApiResponse<Page<MinutesDto.Minutes>> getMinutesList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(adminMinutesService.getMinutesList(page, keyword));
    }
}

