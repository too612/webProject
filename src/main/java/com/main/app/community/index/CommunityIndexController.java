package com.main.app.community.index;

import com.main.app.common.dto.ApiResponse;
import com.main.app.community.index.dto.CommunityIndexDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/community/index")
@RequiredArgsConstructor
public class CommunityIndexController {

    private final CommunityIndexService communityIndexService;

    @GetMapping
    public ApiResponse<CommunityIndexDto> getIndexData() {
        return ApiResponse.ok(communityIndexService.getIndexData());
    }
}
