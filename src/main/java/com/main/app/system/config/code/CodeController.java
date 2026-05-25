package com.main.app.system.config.code;

import com.main.app.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/system/config/codes")
@RequiredArgsConstructor
public class CodeController {

    private final CodeService codeService;

    @GetMapping
    public ApiResponse<Map<String, Object>> getCodeList(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "keyword", required = false) String keyword) {
        return ApiResponse.ok(codeService.getCodeList(page, size, keyword));
    }
}