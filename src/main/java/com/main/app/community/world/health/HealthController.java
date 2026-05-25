package com.main.app.community.world.health;

import com.main.app.common.dto.ApiResponse;
import com.main.app.community.world.health.dto.HealthDto;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller("communityWorldHealthController")
public class HealthController {

    private final HealthService healthService;

    public HealthController(HealthService healthService) {
        this.healthService = healthService;
    }

    @GetMapping("/community/world/health")
    public String healthPage(Model model) {
        model.addAttribute("submenu", "Y");
        return "community/world/health";
    }

    @GetMapping("/api/community/world/health")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getHealthNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        Page<HealthDto> data = healthService.getList(page, size, keyword);
        return ApiResponse.ok(Map.of(
                "content", data.getContent(),
                "totalElements", data.getTotalElements(),
                "totalPages", data.getTotalPages(),
                "number", data.getNumber(),
                "size", data.getSize()));
    }
}