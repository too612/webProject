package com.main.app.official.worship.time;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @GetMapping("/getInfo")
    public ApiResponse<List<TimeDto>> getTimeItems() {
        return ApiResponse.ok(timeService.getTimeItems());
    }

    @PostMapping("/setCreate")
    public ApiResponse<Void> setCreate(@RequestBody List<TimeDto> items) {
        timeService.setCreate(items);
        return ApiResponse.ok(null, "예배시간 정보를 등록했습니다.");
    }

    @PutMapping("/setUpdate")
    public ApiResponse<Void> setUpdate(@RequestBody List<TimeDto> items) {
        timeService.setUpdate(items);
        return ApiResponse.ok(null, "예배시간 정보를 수정했습니다.");
    }

    @DeleteMapping("/delRemove")
    public ApiResponse<Void> delRemove() {
        timeService.delRemove();
        return ApiResponse.ok(null, "예배시간 정보를 삭제했습니다.");
    }
}

