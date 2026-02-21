package com.main.app.community.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 성도 커뮤니티 컨트롤러
 * 경조사, 기도요청, 상품판매, 구인구직 등 성도들 간의 소통 기능을 제공합니다.
 */
@Controller
@RequestMapping("/community/saint")
public class SaintController {

    /**
     * 성도 커뮤니티 페이지들의 공통 모델 속성을 설정합니다.
     * GlobalControllerAdvice에서 이미 모든 메뉴 관련 정보를 처리하므로
     * 여기서는 submenu 플래그만 설정합니다.
     * 
     * @param model 뷰에 전달할 모델 객체
     */
    private void addSaintPageAttributes(Model model) {
        // submenu 사용 플래그 설정 - 이것만으로도 레이아웃에서 submenu 영역이 표시됩니다
        model.addAttribute("submenu", "Y");
    }

    /**
     * 경조사 관리 페이지
     */
    @GetMapping("/family")
    public String familyPage(Model model) {
        addSaintPageAttributes(model);
        return "community/saint/family";
    }

    /**
     * 기도 요청 게시판 페이지
     */
    @GetMapping("/pray")
    public String prayPage(Model model) {
        addSaintPageAttributes(model);
        return "community/saint/pray";
    }

    /**
     * 상품 판매 페이지
     */
    @GetMapping("/sales")
    public String salesPage(Model model) {
        addSaintPageAttributes(model);
        return "community/saint/sales";
    }

    /**
     * 구인구직 페이지
     */
    @GetMapping("/job")
    public String jobPage(Model model) {
        addSaintPageAttributes(model);
        return "community/saint/job";
    }
}
