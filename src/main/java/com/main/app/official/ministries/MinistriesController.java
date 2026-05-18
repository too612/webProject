package com.main.app.official.ministries;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller("officialMinistriesController")
@RequestMapping("/ministries")
public class MinistriesController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/children")
    public String childrenPage(Model model) {
        addPageAttributes(model);
        return "official/ministries/children";
    }

    @GetMapping("/youth")
    public String youthPage(Model model) {
        addPageAttributes(model);
        return "official/ministries/youth";
    }

    @GetMapping("/mission")
    public String missionPage(Model model) {
        addPageAttributes(model);
        return "official/ministries/mission";
    }

    // ===== REST API 메서드 =====

    /**
     * API 페이지 목록
     */
    @GetMapping("/api/ministries/pages")
    @ResponseBody
    public ApiResponse<List<PageMetaDto>> getPages() {
        return ApiResponse.ok(List.of(
                new PageMetaDto("어린이부", "/ministries/children", "ministries", "official/ministries/children"),
                new PageMetaDto("청년부", "/ministries/youth", "ministries", "official/ministries/youth"),
                new PageMetaDto("선교부", "/ministries/mission", "ministries", "official/ministries/mission")));
    }
}
