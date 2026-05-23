package com.main.app.erp.humen;

import com.main.app.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController("erpHumenController")
@RequestMapping("/api/erp/humen")
@RequiredArgsConstructor
public class HumenController {

    private final HumenService humenService;

    @GetMapping("/manager")
    public ApiResponse<Page<HumenDto.Member>> manager(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(humenService.getMemberList(page, keyword));
    }

    @GetMapping("/newcomer")
    public ApiResponse<Page<HumenDto.Member>> newcomer(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(humenService.getNewcomerList(page, keyword));
    }

    @GetMapping("/district")
    public ApiResponse<Page<HumenDto.District>> district(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(humenService.getDistrictList(page, keyword));
    }

    @GetMapping("/change")
    public ApiResponse<Page<HumenDto.Change>> change(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(humenService.getChangeList(page, keyword));
    }
}
