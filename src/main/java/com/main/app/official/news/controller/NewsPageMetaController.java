package com.main.app.official.news.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;

@RestController
@RequestMapping("/api/official/news")
public class NewsPageMetaController {

    @GetMapping("/pages")
    public ApiResponse<List<PageMetaDto>> getPages() {
        return ApiResponse.ok(List.of(
                new PageMetaDto("Announcement", "/news/announcement", "news", "official/news/announcement"),
                new PageMetaDto("Bulletin", "/news/bulletin", "news", "official/news/bulletin"),
                new PageMetaDto("Registration", "/news/registration", "news", "official/news/registration")));
    }
}
