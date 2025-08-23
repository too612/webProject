package com.main.app.controller;

import com.main.app.model.MenuDto;
import com.main.app.service.MainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/company")
public class CompanyController {

    @Autowired
    private MainService mainService;

    /**
     * 회사소개 페이지들의 공통 모델 속성을 설정합니다.
     * @param model 뷰에 전달할 모델 객체
     * @param currentPageId 현재 페이지를 식별하는 ID (e.g., "ceo", "history")
     */
    private void addCompanyPageAttributes(Model model, String currentPageId) {
        List<MenuDto> allMenus = mainService.getMenuList();

        // "회사소개"에 해당하는 최상위 메뉴를 찾습니다.        
        Optional<MenuDto> companyTopMenuOpt = allMenus.stream()
                .filter(menu -> "회사소개".equals(menu.getMenuName()) && menu.getParentId() == null) // 최상위 메뉴 조건
                .findFirst();

        // "회사소개" 메뉴를 찾았을 경우, 해당 메뉴의 하위 메뉴 리스트를 찾아서 설정합니다.
        // 이렇게 하면 템플릿에서 currentTopMenu.subMenus를 안전하게 사용할 수 있습니다.
        if (companyTopMenuOpt.isPresent()) {
            MenuDto companyTopMenu = companyTopMenuOpt.get();

            // '회사소개' 메뉴의 ID를 부모 ID로 갖는 하위 메뉴들을 찾습니다.
            // (MenuDto에 getMenuId(), getParentId(), setSubMenus() 메소드가 있다고 가정합니다.)
            List<MenuDto> subMenus = allMenus.stream()
                    .filter(menu -> companyTopMenu.getMenuId().equals(menu.getParentId()))
                    .collect(Collectors.toList());
            companyTopMenu.setSubMenus(subMenus); // 찾은 하위 메뉴 리스트를 설정합니다.

            model.addAttribute("currentTopMenu", companyTopMenu);
        }

        // 사이드바에서 현재 페이지 메뉴를 'active'로 표시하기 위해 페이지 ID를 모델에 추가합니다.
        model.addAttribute("currentPage", currentPageId);
    }

    @GetMapping("/ceo")
    public String ceoPage(Model model) {
        // 공통 속성 설정 (현재 페이지 ID: "ceo")
        addCompanyPageAttributes(model, "ceo");
        // 뷰 이름 반환 (templates/company/ceo.html)
        return "company/ceo";
    }

    // 다른 회사소개 페이지(연혁, 조직도 등)가 추가될 경우,
    // 유사한 핸들러 메소드를 여기에 추가하면 됩니다.
}