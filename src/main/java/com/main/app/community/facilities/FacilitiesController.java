package com.main.app.community.facilities;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;
import org.springframework.data.domain.Page;
import java.util.Map;
import java.util.List;

@Controller("communityFacilitiesController")
@RequestMapping("/community/facilities")
public class FacilitiesController {

    private final FacilitiesService facilitiesService;

    public FacilitiesController(FacilitiesService facilitiesService) {
        this.facilitiesService = facilitiesService;
    }

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
                new PageMetaDto("Facility Calendar", "/community/facilities/calendar", "community",
                        "community/facilities/calendar"),
                new PageMetaDto("Dining", "/community/facilities/dining", "community", "community/facilities/dining"),
                new PageMetaDto("Prayer Room", "/community/facilities/prayer", "community",
                        "community/facilities/prayer")));
    }

    @GetMapping("/api/community/facilities/calendar")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getCalendar(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month) {
        List<FacilitiesDto> events = facilitiesService.getCalendar(year, month);
        return ApiResponse.ok(Map.of("events", events));
    }

    @GetMapping("/api/community/facilities/dining")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getDiningList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        Page<FacilitiesDto> data = facilitiesService.getDiningList(page, size, keyword);
        return ApiResponse.ok(Map.of(
                "content", data.getContent(),
                "totalElements", data.getTotalElements(),
                "totalPages", data.getTotalPages(),
                "number", data.getNumber(),
                "size", data.getSize()));
    }

    @GetMapping("/api/community/facilities/prayer")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getPrayerInfo() {
        List<FacilitiesDto> rooms = facilitiesService.getPrayerRooms();
        return ApiResponse.ok(Map.of("rooms", rooms));
    }
}
