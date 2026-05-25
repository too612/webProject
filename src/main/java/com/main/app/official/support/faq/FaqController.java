package com.main.app.official.support.faq;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.support.faq.dto.FaqDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/official/support/faq")
@RequiredArgsConstructor
public class FaqController {

    private final FaqService faqService;

    @GetMapping
    public ApiResponse<List<FaqDto>> getFaqItems() {
        return ApiResponse.ok(faqService.getFaqItems());
    }
}