package com.main.app.erp.comm.notice;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.comm.notice.dto.NoticeDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpNoticeController")
@RequestMapping("/api/erp/comm/notice")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService commNoticeService;

    @GetMapping
    public ApiResponse<Page<NoticeDto.Notice>> getNoticeList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(commNoticeService.getNoticeList(page, keyword));
    }
}

