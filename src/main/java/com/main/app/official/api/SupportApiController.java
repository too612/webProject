package com.main.app.official.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;

@RestController
@RequestMapping("/api/official/support")
public class SupportApiController {

    @GetMapping("/pages")
    public ApiResponse<List<PageMetaDto>> getPages() {
        return ApiResponse.ok(List.of(
                new PageMetaDto("오시는 길", "/support/location", "support", "official/support/location"),
                new PageMetaDto("FAQ", "/support/faq", "support", "official/support/faq"),
                new PageMetaDto("문의하기", "/support/qna", "support", "official/support/qna")));
    }
}