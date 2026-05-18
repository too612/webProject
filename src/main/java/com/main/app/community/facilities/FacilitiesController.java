package com.main.app.community.facilities;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;
import java.util.Map;
import java.util.List;

@Controller("communityFacilitiesController")
@RequestMapping("/community/facilities")
public class FacilitiesController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/calendar")
    public String calendarPage(Model model) {
        addPageAttributes(model);
        return "community/facilities/calendar";
    }
    @GetMapping("/dining")
    public String diningPage(Model model) {
        addPageAttributes(model);
        return "community/facilities/dining";
    }
    @GetMapping("/prayer")
    public String prayerPage(Model model) {
        addPageAttributes(model);
        return "community/facilities/prayer";
    }

    // ===== REST API Methods =====

    @GetMapping("/api/community/facilities/pages")
    @ResponseBody
    public ApiResponse<List<PageMetaDto>> getPages() {
        return ApiResponse.ok(List.of(
                new PageMetaDto("Facility Calendar", "/community/facilities/calendar", "community", "community/facilities/calendar"),
                new PageMetaDto("Dining", "/community/facilities/dining", "community", "community/facilities/dining"),
                new PageMetaDto("Prayer Room", "/community/facilities/prayer", "community", "community/facilities/prayer")));
    }

    @GetMapping("/api/community/facilities/calendar")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getCalendar(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month) {
        return ApiResponse.ok(Map.of("events", List.of()));
    }

    @GetMapping("/api/community/facilities/dining")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getDiningList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size));
    }

    @GetMapping("/api/community/facilities/prayer")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getPrayerInfo() {
        return ApiResponse.ok(Map.of("rooms", List.of()));
    }
}

