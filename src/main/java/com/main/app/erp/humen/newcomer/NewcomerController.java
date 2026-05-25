package com.main.app.erp.humen.newcomer;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.humen.newcomer.dto.NewcomerDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpHumenNewcomerController")
@RequestMapping("/api/erp/humen/newcomer")
@RequiredArgsConstructor
public class NewcomerController {

    private final NewcomerService newcomerService;

    @GetMapping
    public ApiResponse<Page<NewcomerDto.Newcomer>> getNewcomerList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(newcomerService.getNewcomerList(page, keyword));
    }
}
