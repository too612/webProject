package com.main.app.community.world.christian;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;
import com.main.app.community.world.christian.dto.ChristianDto;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller("communityWorldChristianController")
public class ChristianController {

    private final ChristianService christianService;

    public ChristianController(ChristianService christianService) {
        this.christianService = christianService;
    }

    @GetMapping("/community/world/christian")
    public String christianPage(Model model) {
        model.addAttribute("submenu", "Y");
        return "community/world/christian";
    }

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
        Page<ChristianDto> data = christianService.getList(page, size, keyword);
        return ApiResponse.ok(Map.of(
                "content", data.getContent(),
                "totalElements", data.getTotalElements(),
                "totalPages", data.getTotalPages(),
                "number", data.getNumber(),
                "size", data.getSize()));
    }
}