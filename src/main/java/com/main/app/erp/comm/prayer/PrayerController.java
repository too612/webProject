package com.main.app.erp.comm.prayer;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.comm.prayer.dto.PrayerDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpPrayerController")
@RequestMapping("/api/erp/comm/prayer")
@RequiredArgsConstructor
public class PrayerController {

    private final PrayerService prayerService;

    @GetMapping
    public ApiResponse<Page<PrayerDto.Prayer>> getPrayerList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(prayerService.getPrayerList(page, keyword));
    }
}
