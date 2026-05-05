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
@RequestMapping("/api/community/group")
public class GroupApiController {

        @GetMapping("/pages")
        public ApiResponse<List<PageMetaDto>> getPages() {
                return ApiResponse.ok(List.of(
                                new PageMetaDto("구역관리", "/community/group/manager", "community",
                                                "community/group/manager"),
                                new PageMetaDto("A1", "/community/group/groupa1", "community",
                                                "community/group/groupa1"),
                                new PageMetaDto("B2", "/community/group/groupb2", "community",
                                                "community/group/groupb2")));
        }

        @GetMapping("/list")
        public ApiResponse<Map<String, Object>> getGroupList(
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

        @GetMapping("/a1")
        public ApiResponse<Map<String, Object>> getGroupA1(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size) {
                return ApiResponse.ok(Map.of(
                                "content", List.of(),
                                "totalElements", 0,
                                "totalPages", 0,
                                "number", page,
                                "size", size));
        }

        @GetMapping("/b2")
        public ApiResponse<Map<String, Object>> getGroupB2(
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