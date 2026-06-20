package com.main.app.official.training.outreach;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.training.outreach.dto.OutreachDto;
import com.main.app.official.training.outreach.dto.OutreachRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/official/training/outreach")
@RequiredArgsConstructor
public class OutreachController {
    private final OutreachService outreachService;

    @GetMapping
    public ApiResponse<OutreachDto> getOutreach() { return ApiResponse.ok(outreachService.getOutreach()); }

    @PostMapping
    public ApiResponse<Void> createOutreach(@RequestBody OutreachRequest request) throws Exception {
        outreachService.createOutreach(request);
        return ApiResponse.ok(null, "아웃리치 정보를 등록했습니다.");
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> updateOutreach(@PathVariable Long id, @RequestBody OutreachRequest request) throws Exception {
        outreachService.updateOutreach(id, request);
        return ApiResponse.ok(null, "아웃리치 정보를 수정했습니다.");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteOutreach(@PathVariable Long id) throws Exception {
        outreachService.deleteOutreach(id);
        return ApiResponse.ok(null, "아웃리치 정보를 삭제했습니다.");
    }
}