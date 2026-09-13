package com.main.app.official.missionary;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.missionary.dto.MissionaryDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController("officialMissionaryController")
@RequestMapping("/api/official/missionaries")
public class MissionaryController {

    private final MissionaryService missionaryService;

    public MissionaryController(MissionaryService missionaryService) {
        this.missionaryService = missionaryService;
    }

    @GetMapping
    public ApiResponse<Map<String, Object>> getMissionaries() {
        List<MissionaryDto> missionaries = missionaryService.getMissionaries();
        Map<String, Object> result = new HashMap<>();
        result.put("missionaries", missionaries);
        return ApiResponse.ok(result);
    }
}
