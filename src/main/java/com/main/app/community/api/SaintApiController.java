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
@RequestMapping("/api/community/saint")
public class SaintApiController {

        @GetMapping("/pages")
        public ApiResponse<List<PageMetaDto>> getPages() {
                return ApiResponse.ok(List.of(
                                new PageMetaDto("가정", "/community/saint/family", "community", "community/saint/family"),
                                new PageMetaDto("기도", "/community/saint/pray", "community", "community/saint/pray"),
                                new PageMetaDto("세일즈", "/community/saint/sales", "community", "community/saint/sales"),
                                new PageMetaDto("직업", "/community/saint/job", "community", "community/saint/job")));
        }

        @GetMapping("/family")
        public ApiResponse<Map<String, Object>> getFamilyList(
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

        @GetMapping("/pray")
        public ApiResponse<Map<String, Object>> getPrayList(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size) {
                return ApiResponse.ok(Map.of(
                                "content", List.of(),
                                "totalElements", 0,
                                "totalPages", 0,
                                "number", page,
                                "size", size));
        }

        @GetMapping("/sales")
        public ApiResponse<Map<String, Object>> getSalesList(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size) {
                return ApiResponse.ok(Map.of(
                                "content", List.of(),
                                "totalElements", 0,
                                "totalPages", 0,
                                "number", page,
                                "size", size));
        }

        @GetMapping("/job")
        public ApiResponse<Map<String, Object>> getJobList(
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