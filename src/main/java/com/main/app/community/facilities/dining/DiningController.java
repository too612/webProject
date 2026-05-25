package com.main.app.community.facilities.dining;

import com.main.app.common.dto.ApiResponse;
import com.main.app.community.facilities.dining.dto.DiningDto;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller("communityFacilitiesDiningController")
public class DiningController {

    private final DiningService diningService;

    public DiningController(DiningService diningService) {
        this.diningService = diningService;
    }

    @GetMapping("/community/facilities/dining")
    public String diningPage(Model model) {
        model.addAttribute("submenu", "Y");
        return "community/facilities/dining";
    }

    @GetMapping("/api/community/facilities/dining")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getDiningList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        Page<DiningDto> data = diningService.getDiningList(page, size, keyword);
        return ApiResponse.ok(Map.of(
                "content", data.getContent(),
                "totalElements", data.getTotalElements(),
                "totalPages", data.getTotalPages(),
                "number", data.getNumber(),
                "size", data.getSize()));
    }
}