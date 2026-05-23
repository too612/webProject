package com.main.app.official.about.beliefs;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.about.beliefs.dto.BeliefsDto;
import com.main.app.official.about.beliefs.dto.BeliefsRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/official/about/beliefs")
@RequiredArgsConstructor
public class BeliefsController {

    private final BeliefsService beliefsService;

    @GetMapping
    public ApiResponse<BeliefsDto> getBeliefs() {
        return ApiResponse.ok(beliefsService.getBeliefs());
    }

    @PostMapping
    public ApiResponse<Void> createBeliefs(@RequestBody BeliefsRequest request) throws Exception {
        beliefsService.createBeliefs(request);
        return ApiResponse.ok(null, "신앙고백 정보를 등록했습니다.");
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> updateBeliefs(@PathVariable Long id, @RequestBody BeliefsRequest request)
            throws Exception {
        beliefsService.updateBeliefs(id, request);
        return ApiResponse.ok(null, "신앙고백 정보를 수정했습니다.");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteBeliefs(@PathVariable Long id) throws Exception {
        beliefsService.deleteBeliefs(id);
        return ApiResponse.ok(null, "신앙고백 정보를 삭제했습니다.");
    }
}
