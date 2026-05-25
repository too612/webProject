package com.main.app.community.saint.family;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;
import com.main.app.community.saint.family.dto.FamilyDto;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller("communitySaintFamilyController")
public class FamilyController {

    private final FamilyService familyService;

    public FamilyController(FamilyService familyService) {
        this.familyService = familyService;
    }

    @GetMapping("/community/saint/family")
    public String familyPage(Model model) {
        model.addAttribute("submenu", "Y");
        return "community/saint/family";
    }

    @GetMapping("/api/community/saint/pages")
    @ResponseBody
    public ApiResponse<List<PageMetaDto>> getPages() {
        return ApiResponse.ok(List.of(
                new PageMetaDto("Family", "/community/saint/family", "community", "community/saint/family"),
                new PageMetaDto("Prayer", "/community/saint/pray", "community", "community/saint/pray"),
                new PageMetaDto("Sales", "/community/saint/sales", "community", "community/saint/sales"),
                new PageMetaDto("Job", "/community/saint/job", "community", "community/saint/job")));
    }

    @GetMapping("/api/community/saint/family")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getFamilyList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        Page<FamilyDto> data = familyService.getList(page, size, keyword);
        return ApiResponse.ok(Map.of(
                "content", data.getContent(),
                "totalElements", data.getTotalElements(),
                "totalPages", data.getTotalPages(),
                "number", data.getNumber(),
                "size", data.getSize()));
    }
}