package com.main.app.official.about.history;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.about.history.dto.HistoryDto;
import com.main.app.official.about.history.dto.HistoryRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/official/about/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping
    public ApiResponse<HistoryDto> getHistory() {
        return ApiResponse.ok(historyService.getHistory());
    }

    @PostMapping
    public ApiResponse<Void> createHistory(@RequestBody HistoryRequest request) throws Exception {
        historyService.createHistory(request);
        return ApiResponse.ok(null, "연혁 정보를 등록했습니다.");
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> updateHistory(@PathVariable Long id, @RequestBody HistoryRequest request)
            throws Exception {
        historyService.updateHistory(id, request);
        return ApiResponse.ok(null, "연혁 정보를 수정했습니다.");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteHistory(@PathVariable Long id) throws Exception {
        historyService.deleteHistory(id);
        return ApiResponse.ok(null, "연혁 정보를 삭제했습니다.");
    }
}
