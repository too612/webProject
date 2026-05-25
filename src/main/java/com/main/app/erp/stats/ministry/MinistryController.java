package com.main.app.erp.stats.ministry;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.stats.ministry.dto.MinistryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController("erpStatsMinistryController")
@RequestMapping("/api/erp/stats/ministry")
@RequiredArgsConstructor
public class MinistryController {

    private final MinistryService ministryService;

    @GetMapping
    public ApiResponse<Map<String, Object>> list(@RequestParam(required = false) String year) {
        List<MinistryDto.MinistryStat> content = ministryService.getMinistryStats(year);
        return ApiResponse.ok(Map.of("content", content));
    }
}