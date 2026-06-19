package com.main.app.official.ministries.congregation;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.ministries.congregation.dto.CongregationDto;
import com.main.app.official.ministries.congregation.dto.CongregationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/official/ministries/congregation")
@RequiredArgsConstructor
public class CongregationController {

    private final CongregationService congregationService;

    @GetMapping
    public ApiResponse<CongregationDto> getCongregation() {
        return ApiResponse.ok(congregationService.getCongregation());
    }

    @PostMapping
    public ApiResponse<Void> createCongregation(@RequestBody CongregationRequest request) throws Exception {
        congregationService.createCongregation(request);
        return ApiResponse.ok(null, "공동체 안내 정보를 등록했습니다.");
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> updateCongregation(@PathVariable Long id, @RequestBody CongregationRequest request)
            throws Exception {
        congregationService.updateCongregation(id, request);
        return ApiResponse.ok(null, "공동체 안내 정보를 수정했습니다.");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCongregation(@PathVariable Long id) throws Exception {
        congregationService.deleteCongregation(id);
        return ApiResponse.ok(null, "공동체 안내 정보를 삭제했습니다.");
    }
}