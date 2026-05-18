package com.main.app.community.saint;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;
import java.util.Map;
import java.util.List;

@Controller("communitySaintController")
@RequestMapping("/community/saint")
public class SaintController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/family")
    public String familyPage(Model model) {
        addPageAttributes(model);
        return "community/saint/family";
    }
    @GetMapping("/pray")
    public String prayPage(Model model) {
        addPageAttributes(model);
        return "community/saint/pray";
    }
    @GetMapping("/sales")
    public String salesPage(Model model) {
        addPageAttributes(model);
        return "community/saint/sales";
    }
    @GetMapping("/job")
    public String jobPage(Model model) {
        addPageAttributes(model);
        return "community/saint/job";
    }

    // ===== REST API Methods =====

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
        return ApiResponse.ok(Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size));
    }

    @GetMapping("/api/community/saint/pray")
    @ResponseBody
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

    @GetMapping("/api/community/saint/sales")
    @ResponseBody
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

    @GetMapping("/api/community/saint/job")
    @ResponseBody
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

