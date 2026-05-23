package com.main.app.official.worship.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;

@RestController
@RequestMapping("/api/official/worship")
public class WorshipPageMetaController {

    @GetMapping("/pages")
    public ApiResponse<List<PageMetaDto>> getPages() {
        return ApiResponse.ok(List.of(
                new PageMetaDto("Service Time", "/worship/time", "worship", "official/worship/time"),
                new PageMetaDto("Live Worship", "/worship/live", "worship", "official/worship/live"),
                new PageMetaDto("Sermons", "/worship/sermons", "worship", "official/worship/sermons")));
    }
}
