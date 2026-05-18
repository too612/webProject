package com.main.app.official.support;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller("officialSupportController")
@RequestMapping("/support")
public class SupportController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/location")
    public String locationPage(Model model) {
        addPageAttributes(model);
        return "official/support/location";
    }

    @GetMapping("/qna")
    public String qnaPage(Model model) {
        addPageAttributes(model);
        return "official/support/qna";
    }

    @GetMapping("/faq")
    public String faqPage(Model model) {
        addPageAttributes(model);
        return "official/support/faq";
    }

    // ===== REST API 메서드 =====

    /**
     * API 페이지 목록
     */
    @GetMapping("/api/support/pages")
    @ResponseBody
    public ApiResponse<List<PageMetaDto>> getPages() {
        return ApiResponse.ok(List.of(
                new PageMetaDto("Directions", "/support/location", "support", "official/support/location"),
                new PageMetaDto("FAQ", "/support/faq", "support", "official/support/faq"),
                new PageMetaDto("QnA", "/support/qna", "support", "official/support/qna")));
    }
}
