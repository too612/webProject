package com.main.app.community.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/community/group")
public class GroupController {

    /**
     * 셀모임 페이지들의 공통 모델 속성을 설정합니다.
     * GlobalControllerAdvice에서 이미 모든 메뉴 관련 정보를 처리하므로
     * 여기서는 submenu 플래그만 설정합니다.
     * 
     * @param model 뷰에 전달할 모델 객체
     */
    private void addGroupPageAttributes(Model model) {
        // submenu 사용 플래그 설정 - 이것만으로도 레이아웃에서 submenu 영역이 표시됩니다
        model.addAttribute("submenu", "Y");
        
        // 추가적인 페이지별 설정이 필요한 경우 여기에 추가
        // 예: model.addAttribute("pageType", "group");
    }

    @GetMapping("/manager")
    public String managerPage(Model model) {
        // 공통 속성 설정
        addGroupPageAttributes(model);
        
        return "community/group/manager";
    }

    @GetMapping("/groupa1")
    public String groupA1Page(Model model) {
        addGroupPageAttributes(model);

        return "community/group/groupa1";
    }

    @GetMapping("/groupb2")
    public String groupB2Page(Model model) {
        addGroupPageAttributes(model);

        return "community/group/groupb2";
    }
}
