package com.main.app.official.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;

@RestController
@RequestMapping("/api/official/worship")
public class WorshipApiController {

    @GetMapping("/pages")
    public ApiResponse<List<PageMetaDto>> getPages() {
        return ApiResponse.ok(List.of(
                new PageMetaDto("예배시간", "/worship/time", "worship", "official/worship/time"),
                new PageMetaDto("온라인예배", "/worship/live", "worship", "official/worship/live"),
                new PageMetaDto("설교말씀", "/worship/sermons", "worship", "official/worship/sermons")));
    }
}