package com.main.app.official.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;

@RestController
@RequestMapping("/api/official/about")
public class AboutApiController {

    @GetMapping("/pages")
    public ApiResponse<List<PageMetaDto>> getPages() {
        return ApiResponse.ok(List.of(
                new PageMetaDto("담임목사", "/about/pastor", "about", "official/about/pastor"),
                new PageMetaDto("비전", "/about/vision", "about", "official/about/vision"),
                new PageMetaDto("연혁", "/about/history", "about", "official/about/history"),
                new PageMetaDto("신앙고백", "/about/beliefs", "about", "official/about/beliefs")));
    }
}