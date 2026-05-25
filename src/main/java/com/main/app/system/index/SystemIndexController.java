package com.main.app.system.index;

import com.main.app.common.dto.ApiResponse;
import com.main.app.system.index.dto.SystemIndexDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/system/index")
@RequiredArgsConstructor
public class SystemIndexController {

    private final SystemIndexService systemIndexService;

    @GetMapping
    public ApiResponse<SystemIndexDto> getIndexData() {
        return ApiResponse.ok(systemIndexService.getIndexData());
    }
}
