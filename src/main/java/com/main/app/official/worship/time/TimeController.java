package com.main.app.official.worship.time;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.worship.time.dto.TimeDto;

@RestController
@RequestMapping("/api/official/worship/time")
public class TimeController {

    private final TimeService timeService;

    public TimeController(TimeService timeService) {
        this.timeService = timeService;
    }

    @GetMapping
    public ApiResponse<List<TimeDto>> getTimeItems() {
        return ApiResponse.ok(timeService.getTimeItems());
    }
}
