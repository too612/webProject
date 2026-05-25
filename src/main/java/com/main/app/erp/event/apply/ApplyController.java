package com.main.app.erp.event.apply;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.event.apply.dto.ApplyDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpEventApplyController")
@RequestMapping("/api/erp/event/apply")
@RequiredArgsConstructor
public class ApplyController {

    private final ApplyService applyService;

    @GetMapping
    public ApiResponse<Page<ApplyDto.Apply>> getApplyList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(applyService.getApplyList(page, keyword));
    }
}