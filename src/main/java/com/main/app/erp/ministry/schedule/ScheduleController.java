package com.main.app.erp.ministry.schedule;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.ministry.schedule.dto.ScheduleDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpMinistryScheduleController")
@RequestMapping("/api/erp/ministry/schedule")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping
    public ApiResponse<Page<ScheduleDto.Schedule>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(scheduleService.getScheduleList(page, keyword));
    }
}
