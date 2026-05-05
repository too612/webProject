package com.main.app.community.api;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;

@RestController
@RequestMapping("/api/community/world")
public class WorldApiController {

        @GetMapping("/pages")
        public ApiResponse<List<PageMetaDto>> getPages() {
                return ApiResponse.ok(List.of(
                                new PageMetaDto("기독교", "/community/world/christian", "community",
                                                "community/world/christian"),
                                new PageMetaDto("경제", "/community/world/economic", "community",
                                                "community/world/economic"),
                                new PageMetaDto("건강", "/community/world/health", "community",
                                                "community/world/health")));
        }

        @GetMapping("/christian")
        public ApiResponse<Map<String, Object>> getChristianNews(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(required = false) String keyword) {
                return ApiResponse.ok(Map.of(
                                "content", List.of(),
                                "totalElements", 0,
                                "totalPages", 0,
                                "number", page,
                                "size", size));
        }

        @GetMapping("/economic")
        public ApiResponse<Map<String, Object>> getEconomicNews(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size) {
                return ApiResponse.ok(Map.of(
                                "content", List.of(),
                                "totalElements", 0,
                                "totalPages", 0,
                                "number", page,
                                "size", size));
        }

        @GetMapping("/health")
        public ApiResponse<Map<String, Object>> getHealthNews(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size) {
                return ApiResponse.ok(Map.of(
                                "content", List.of(),
                                "totalElements", 0,
                                "totalPages", 0,
                                "number", page,
                                "size", size));
        }
}