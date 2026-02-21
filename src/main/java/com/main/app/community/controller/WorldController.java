package com.main.app.community.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 세계 정보 컨트롤러
 * 기독교 뉴스, 경제 정보, 건강 정보 등 세계 각국의 다양한 정보를 제공합니다.
 */
@Controller
@RequestMapping("/community/world")
public class WorldController {

    /**
     * 세계 정보 페이지들의 공통 모델 속성을 설정합니다.
     * GlobalControllerAdvice에서 이미 모든 메뉴 관련 정보를 처리하므로
     * 여기서는 submenu 플래그만 설정합니다.
     * 
     * @param model 뷰에 전달할 모델 객체
     */
    private void addWorldPageAttributes(Model model) {
        // submenu 사용 플래그 설정 - 이것만으로도 레이아웃에서 submenu 영역이 표시됩니다
        model.addAttribute("submenu", "Y");
    }

    /**
     * 기독교 뉴스 페이지
     */
    @GetMapping("/christian")
    public String christianPage(Model model) {
        addWorldPageAttributes(model);
        return "community/world/christian";
    }

    /**
     * 경제 정보 페이지
     */
    @GetMapping("/economic")
    public String economicPage(Model model) {
        addWorldPageAttributes(model);
        return "community/world/economic";
    }

    /**
     * 건강 정보 페이지
     */
    @GetMapping("/health")
    public String healthPage(Model model) {
        addWorldPageAttributes(model);
        return "community/world/health";
    }
}
