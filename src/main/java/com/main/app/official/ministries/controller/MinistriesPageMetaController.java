package com.main.app.official.ministries.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;

@RestController
@RequestMapping("/api/official/ministries")
public class MinistriesPageMetaController {

    @GetMapping("/pages")
    public ApiResponse<List<PageMetaDto>> getPages() {
        return ApiResponse.ok(List.of(
                new PageMetaDto("Children", "/ministries/children", "ministries", "official/ministries/children"),
                new PageMetaDto("Youth", "/ministries/youth", "ministries", "official/ministries/youth"),
                new PageMetaDto("Mission", "/ministries/mission", "ministries", "official/ministries/mission")));
    }
}
