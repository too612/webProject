package com.main.app.official.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;

@RestController
@RequestMapping("/api/official/ministries")
public class MinistriesApiController {

    @GetMapping("/pages")
    public ApiResponse<List<PageMetaDto>> getPages() {
        return ApiResponse.ok(List.of(
                new PageMetaDto("어린이부", "/ministries/children", "ministries", "official/ministries/children"),
                new PageMetaDto("청년부", "/ministries/youth", "ministries", "official/ministries/youth"),
                new PageMetaDto("선교부", "/ministries/mission", "ministries", "official/ministries/mission")));
    }
}