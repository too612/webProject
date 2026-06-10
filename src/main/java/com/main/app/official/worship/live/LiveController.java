package com.main.app.official.worship.live;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.worship.live.dto.LiveDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins = "http://localhost:5173") // 개발 서버 허용
@RestController
@RequestMapping("/api/official/worship/live")
@RequiredArgsConstructor
@Slf4j
public class LiveController {

    private final LiveService liveService;

    @GetMapping("")
    public ApiResponse<List<LiveDto>> getLiveItems(
            @RequestParam(required = false, defaultValue = "sunday_day") String category) {
        log.info("[LiveController] 온라인 예배 목록 조회 요청 수신");
        return ApiResponse.ok(liveService.getLiveItems(category));
    }
}
