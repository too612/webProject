package com.main.app.official.worship;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller("officialWorshipController")
@RequestMapping("/worship")
public class WorshipController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/time")
    public String timePage(Model model) {
        addPageAttributes(model);
        return "official/worship/time";
    }

    @GetMapping("/live")
    public String livePage(Model model) {
        addPageAttributes(model);
        return "official/worship/live";
    }

    @GetMapping("/sermons")
    public String sermonsPage(Model model) {
        addPageAttributes(model);
        return "official/worship/sermons";
    }

    // ===== REST API 메서드 =====

    /**
     * API 페이지 목록
     */
    @GetMapping("/api/worship/pages")
    @ResponseBody
    public ApiResponse<List<PageMetaDto>> getPages() {
        return ApiResponse.ok(List.of(
                new PageMetaDto("Service Time", "/worship/time", "worship", "official/worship/time"),
                new PageMetaDto("Live Worship", "/worship/live", "worship", "official/worship/live"),
                new PageMetaDto("Sermons", "/worship/sermons", "worship", "official/worship/sermons")));
    }
}
