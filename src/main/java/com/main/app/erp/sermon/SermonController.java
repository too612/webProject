package com.main.app.erp.sermon;

import com.main.app.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController("erpSermonController")
@RequestMapping("/api/erp/sermon")
@RequiredArgsConstructor
public class SermonController {

    private final SermonService sermonService;

    @GetMapping("/manager")
    public ApiResponse<Page<SermonErpDto.Worship>> manager(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(sermonService.getWorshipList(page, keyword));
    }

    @GetMapping("/archive")
    public ApiResponse<Page<SermonErpDto.Worship>> archive(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(sermonService.getArchiveList(page, keyword));
    }

    @GetMapping("/attendance")
    public ApiResponse<Page<SermonErpDto.Attendance>> attendance(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(sermonService.getAttendanceList(page, keyword));
    }

    @GetMapping("/order")
    public ApiResponse<Page<SermonErpDto.Order>> order(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String worshipId) {
        return ApiResponse.ok(sermonService.getOrderList(page, worshipId));
    }
}
