package com.main.app.official.index;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.index.dto.OfficialIndexDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/official/index")
@RequiredArgsConstructor
public class OfficialIndexController {

    private final OfficialIndexService officialIndexService;

    @GetMapping
    public ApiResponse<OfficialIndexDto> getIndexData() {
        return ApiResponse.ok(officialIndexService.getIndexData());
    }
}
