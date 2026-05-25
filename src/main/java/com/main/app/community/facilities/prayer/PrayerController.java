package com.main.app.community.facilities.prayer;

import com.main.app.common.dto.ApiResponse;
import com.main.app.community.facilities.prayer.dto.PrayerDto;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller("communityFacilitiesPrayerController")
public class PrayerController {

    private final PrayerService prayerService;

    public PrayerController(PrayerService prayerService) {
        this.prayerService = prayerService;
    }

    @GetMapping("/community/facilities/prayer")
    public String prayerPage(Model model) {
        model.addAttribute("submenu", "Y");
        return "community/facilities/prayer";
    }

    @GetMapping("/api/community/facilities/prayer")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getPrayerInfo() {
        List<PrayerDto> rooms = prayerService.getPrayerRooms();
        return ApiResponse.ok(Map.of("rooms", rooms));
    }
}