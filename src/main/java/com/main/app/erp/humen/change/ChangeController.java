package com.main.app.erp.humen.change;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.humen.change.dto.ChangeDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpHumenChangeController")
@RequestMapping("/api/erp/humen/change")
@RequiredArgsConstructor
public class ChangeController {

    private final ChangeService changeService;

    @GetMapping
    public ApiResponse<Page<ChangeDto.Change>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(changeService.getChangeList(page, keyword));
    }
}
