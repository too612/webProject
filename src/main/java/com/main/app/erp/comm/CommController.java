package com.main.app.erp.comm;

import com.main.app.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController("erpCommController")
@RequestMapping("/api/erp/comm")
@RequiredArgsConstructor
public class CommController {

    private final CommService commService;

    @GetMapping("/notice")
    public ApiResponse<Page<CommDto.Notice>> notice(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(commService.getNoticeList(page, keyword));
    }

    @GetMapping("/message")
    public ApiResponse<Page<CommDto.Message>> message(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(commService.getMessageList(page, keyword));
    }

    @GetMapping("/prayer")
    public ApiResponse<Page<CommDto.Prayer>> prayer(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(commService.getPrayerList(page, keyword));
    }

    @GetMapping("/newsletter")
    public ApiResponse<Page<CommDto.Newsletter>> newsletter(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(commService.getNewsletterList(page, keyword));
    }
}
