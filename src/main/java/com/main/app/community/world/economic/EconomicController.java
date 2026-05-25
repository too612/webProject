package com.main.app.community.world.economic;

import com.main.app.common.dto.ApiResponse;
import com.main.app.community.world.economic.dto.EconomicDto;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller("communityWorldEconomicController")
public class EconomicController {

    private final EconomicService economicService;

    public EconomicController(EconomicService economicService) {
        this.economicService = economicService;
    }

    @GetMapping("/community/world/economic")
    public String economicPage(Model model) {
        model.addAttribute("submenu", "Y");
        return "community/world/economic";
    }

    @GetMapping("/api/community/world/economic")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getEconomicNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        Page<EconomicDto> data = economicService.getList(page, size, keyword);
        return ApiResponse.ok(Map.of(
                "content", data.getContent(),
                "totalElements", data.getTotalElements(),
                "totalPages", data.getTotalPages(),
                "number", data.getNumber(),
                "size", data.getSize()));
    }
}