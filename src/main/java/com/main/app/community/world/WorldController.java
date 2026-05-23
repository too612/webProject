package com.main.app.community.world;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;
import org.springframework.data.domain.Page;
import java.util.Map;
import java.util.List;

@Controller("communityWorldController")
@RequestMapping("/community/world")
public class WorldController {

    private final WorldService worldService;

    public WorldController(WorldService worldService) {
        this.worldService = worldService;
    }

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/christian")
    public String christianPage(Model model) {
        addPageAttributes(model);
        return "community/world/christian";
    }

    @GetMapping("/economic")
    public String economicPage(Model model) {
        addPageAttributes(model);
        return "community/world/economic";
    }

    @GetMapping("/health")
    public String healthPage(Model model) {
        addPageAttributes(model);
        return "community/world/health";
    }

    // ===== REST API Methods =====

    @GetMapping("/api/community/world/pages")
    @ResponseBody
    public ApiResponse<List<PageMetaDto>> getPages() {
        return ApiResponse.ok(List.of(
                new PageMetaDto("Christian News", "/community/world/christian", "community",
                        "community/world/christian"),
                new PageMetaDto("Economic News", "/community/world/economic", "community", "community/world/economic"),
                new PageMetaDto("Health News", "/community/world/health", "community", "community/world/health")));
    }

    @GetMapping("/api/community/world/christian")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getChristianNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        Page<WorldDto> data = worldService.getChristianNews(page, size, keyword);
        return ApiResponse.ok(Map.of(
                "content", data.getContent(),
                "totalElements", data.getTotalElements(),
                "totalPages", data.getTotalPages(),
                "number", data.getNumber(),
                "size", data.getSize()));
    }

    @GetMapping("/api/community/world/economic")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getEconomicNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        Page<WorldDto> data = worldService.getEconomicNews(page, size, keyword);
        return ApiResponse.ok(Map.of(
                "content", data.getContent(),
                "totalElements", data.getTotalElements(),
                "totalPages", data.getTotalPages(),
                "number", data.getNumber(),
                "size", data.getSize()));
    }

    @GetMapping("/api/community/world/health")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getHealthNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        Page<WorldDto> data = worldService.getHealthNews(page, size, keyword);
        return ApiResponse.ok(Map.of(
                "content", data.getContent(),
                "totalElements", data.getTotalElements(),
                "totalPages", data.getTotalPages(),
                "number", data.getNumber(),
                "size", data.getSize()));
    }
}
