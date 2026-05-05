package com.main.app.official.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;

@RestController
@RequestMapping("/api/official/news")
public class NewsApiController {

    @GetMapping("/pages")
    public ApiResponse<List<PageMetaDto>> getPages() {
        return ApiResponse.ok(List.of(
                new PageMetaDto("행사안내", "/news/event", "news", "official/news/event"),
                new PageMetaDto("공지사항", "/news/announcement", "news", "official/news/announcement"),
                new PageMetaDto("주보", "/news/bulletin", "news", "official/news/bulletin"),
                new PageMetaDto("등록안내", "/news/registration", "news", "official/news/registration")));
    }
}