package com.main.app.official.news.mission;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.news.mission.dto.MissionDto;
import com.main.app.official.news.mission.dto.MissionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController("newsMissionController")
@RequestMapping("/api/official/news/mission")
@RequiredArgsConstructor
public class MissionController {
    private final MissionService missionService;

    @GetMapping
    public ApiResponse<MissionDto> getMission() { return ApiResponse.ok(missionService.getMission()); }

    @PostMapping
    public ApiResponse<Void> createMission(@RequestBody MissionRequest request) throws Exception {
        missionService.createMission(request);
        return ApiResponse.ok(null, "선교지소식을 등록했습니다.");
    }

    @PutMapping
    public ApiResponse<Void> updateMission(@RequestBody MissionRequest request) throws Exception {
        missionService.updateMission(request);
        return ApiResponse.ok(null, "선교지소식을 수정했습니다.");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteMission(@PathVariable String id) throws Exception {
        missionService.deleteMission(id);
        return ApiResponse.ok(null, "선교지소식을 삭제했습니다.");
    }
}