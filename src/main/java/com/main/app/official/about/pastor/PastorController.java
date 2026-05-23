package com.main.app.official.about.pastor;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.about.pastor.dto.PastorDto;
import com.main.app.official.about.pastor.dto.PastorRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/official/about/pastor")
@RequiredArgsConstructor
public class PastorController {

    private final PastorService pastorService;

    @GetMapping
    public ApiResponse<PastorDto> getPastorProfile() {
        return ApiResponse.ok(pastorService.getPastorProfile());
    }

    @PostMapping
    public ApiResponse<Void> createPastorProfile(@RequestBody PastorRequest request) throws Exception {
        pastorService.createPastorProfile(request);
        return ApiResponse.ok(null, "담임목사 정보를 등록했습니다.");
    }

    @PutMapping("/{corpId}")
    public ApiResponse<Void> updatePastorProfile(@PathVariable Long corpId, @RequestBody PastorRequest request)
            throws Exception {
        pastorService.updatePastorProfile(corpId, request);
        return ApiResponse.ok(null, "담임목사 정보를 수정했습니다.");
    }

    @DeleteMapping("/{corpId}")
    public ApiResponse<Void> deletePastorProfile(
            @PathVariable Long corpId,
            @RequestParam String updatedBy,
            @RequestParam String updatedIp) throws Exception {
        pastorService.deletePastorProfile(corpId, updatedBy, updatedIp);
        return ApiResponse.ok(null, "담임목사 정보를 삭제했습니다.");
    }
}
