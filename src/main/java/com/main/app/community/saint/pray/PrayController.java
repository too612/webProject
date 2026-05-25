package com.main.app.community.saint.pray;

import com.main.app.common.dto.ApiResponse;
import com.main.app.community.saint.pray.dto.PrayDto;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller("communitySaintPrayController")
public class PrayController {

    private final PrayService prayService;

    public PrayController(PrayService prayService) {
        this.prayService = prayService;
    }

    @GetMapping("/community/saint/pray")
    public String prayPage(Model model) {
        model.addAttribute("submenu", "Y");
        return "community/saint/pray";
    }

    @GetMapping("/api/community/saint/pray")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getPrayList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        Page<PrayDto> data = prayService.getList(page, size, keyword);
        return ApiResponse.ok(Map.of(
                "content", data.getContent(),
                "totalElements", data.getTotalElements(),
                "totalPages", data.getTotalPages(),
                "number", data.getNumber(),
                "size", data.getSize()));
    }
}