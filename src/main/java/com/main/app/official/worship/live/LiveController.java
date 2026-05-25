package com.main.app.official.worship.live;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.worship.live.dto.LiveDto;

@RestController
@RequestMapping("/api/official/worship/live")
public class LiveController {

    private final LiveService liveService;

    public LiveController(LiveService liveService) {
        this.liveService = liveService;
    }

    @GetMapping
    public ApiResponse<List<LiveDto>> getLiveItems() {
        return ApiResponse.ok(liveService.getLiveItems());
    }
}
