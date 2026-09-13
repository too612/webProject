package com.main.app.official.about.history;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.about.history.dto.HistoryDto;
import com.main.app.official.about.history.dto.HistoryRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/official/about/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping("/getInfo")
    public ApiResponse<HistoryDto> getInfo() {
        return ApiResponse.ok(historyService.getHistory());
    }

    @PostMapping("/setCreate")
    public ApiResponse<Void> setCreate(@RequestBody HistoryRequest request) {
        historyService.setCreate(request);
        return ApiResponse.ok(null, "연혁 정보를 등록했습니다.");
    }

    @PutMapping("/setUpdate")
    public ApiResponse<Void> setUpdate(@RequestBody HistoryRequest request) {
        historyService.setUpdate(request);
        return ApiResponse.ok(null, "연혁 정보를 수정했습니다.");
    }

    @DeleteMapping("/delRemove")
    public ApiResponse<Void> delRemove() {
        historyService.delRemove();
        return ApiResponse.ok(null, "연혁 정보를 삭제했습니다.");
    }
}
