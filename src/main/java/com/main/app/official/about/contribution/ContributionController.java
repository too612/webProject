package com.main.app.official.about.contribution;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.about.contribution.dto.ContributionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/official/about/contribution")
@RequiredArgsConstructor
public class ContributionController {

    private final ContributionService contributionService;

    @GetMapping
    public ApiResponse<ContributionDto> getContributionInfo() {
        return ApiResponse.ok(contributionService.getInfo());
    }
}
