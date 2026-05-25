package com.main.app.erp.stats.offering;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.stats.offering.dto.OfferingDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController("erpStatsOfferingController")
@RequestMapping("/api/erp/stats/offering")
@RequiredArgsConstructor
public class OfferingController {

    private final OfferingService offeringService;

    @GetMapping
    public ApiResponse<Map<String, Object>> list(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month) {
        List<OfferingDto.OfferingStat> content = offeringService.getOfferingStats(year, month);
        return ApiResponse.ok(Map.of("content", content));
    }
}
