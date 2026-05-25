package com.main.app.erp.comm.newsletter;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.comm.newsletter.dto.NewsletterDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpNewsletterController")
@RequestMapping("/api/erp/comm/newsletter")
@RequiredArgsConstructor
public class NewsletterController {

    private final NewsletterService newsletterService;

    @GetMapping
    public ApiResponse<Page<NewsletterDto.Newsletter>> getNewsletterList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(newsletterService.getNewsletterList(page, keyword));
    }
}
