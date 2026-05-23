package com.main.app.official.about.vision;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.about.vision.dto.VisionDto;
import com.main.app.official.about.vision.dto.VisionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/official/about/vision")
@RequiredArgsConstructor
public class VisionController {

    private final VisionService visionService;

    @GetMapping
    public ApiResponse<VisionDto> getVision() {
        return ApiResponse.ok(visionService.getVision());
    }

    @PostMapping
    public ApiResponse<Void> createVision(@RequestBody VisionRequest request) throws Exception {
        visionService.createVision(request);
        return ApiResponse.ok(null, "비전 정보를 등록했습니다.");
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> updateVision(@PathVariable Long id, @RequestBody VisionRequest request) throws Exception {
        visionService.updateVision(id, request);
        return ApiResponse.ok(null, "비전 정보를 수정했습니다.");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteVision(@PathVariable Long id) throws Exception {
        visionService.deleteVision(id);
        return ApiResponse.ok(null, "비전 정보를 삭제했습니다.");
    }
}
