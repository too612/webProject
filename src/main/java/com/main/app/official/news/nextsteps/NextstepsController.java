package com.main.app.official.news.nextsteps;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.news.nextsteps.dto.NextstepsDto;
import com.main.app.official.news.nextsteps.dto.NextstepsRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController("newsNextstepsController")
@RequestMapping("/api/official/news/nextsteps")
@RequiredArgsConstructor
public class NextstepsController {
    private final NextstepsService nextstepsService;

    @GetMapping
    public ApiResponse<NextstepsDto> getNextsteps() { return ApiResponse.ok(nextstepsService.getNextsteps()); }

    @PostMapping
    public ApiResponse<Void> createNextsteps(@RequestBody NextstepsRequest request) throws Exception {
        nextstepsService.createNextsteps(request);
        return ApiResponse.ok(null, "새가족안내를 등록했습니다.");
    }

    @PutMapping
    public ApiResponse<Void> updateNextsteps(@RequestBody NextstepsRequest request) throws Exception {
        nextstepsService.updateNextsteps(request);
        return ApiResponse.ok(null, "새가족안내를 수정했습니다.");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteNextsteps(@PathVariable String id) throws Exception {
        nextstepsService.deleteNextsteps(id);
        return ApiResponse.ok(null, "새가족안내를 삭제했습니다.");
    }
}