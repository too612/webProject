package com.main.app.system.controller;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Controller
@RequestMapping("/system")
public class SystemIndexController {

        private static final Map<String, Map<String, SystemPageMeta>> SYSTEM_PAGE_META = Map.of(
                        "user", Map.of(
                                        "manager",
                                        new SystemPageMeta("M_ADM_01_01", "M_ADM_01", "사용자계정관리", "/system/user/manager",
                                                        "시스템 사용자 계정을 생성·수정·잠금해제하는 기본 관리 화면입니다."),
                                        "role",
                                        new SystemPageMeta("M_ADM_01_02", "M_ADM_01", "권한역할관리", "/system/user/role",
                                                        "역할(Role)별 메뉴 접근 권한을 정의하는 기본 관리 화면입니다.")),
                        "config", Map.of(
                                        "code",
                                        new SystemPageMeta("M_ADM_02_01", "M_ADM_02", "공통코드관리", "/system/config/code",
                                                        "시스템 전역에서 사용하는 공통코드 항목을 관리하는 기본 화면입니다."),
                                        "menu",
                                        new SystemPageMeta("M_ADM_02_02", "M_ADM_02", "메뉴권한관리", "/system/config/menu",
                                                        "메뉴별 접근 권한을 역할에 매핑하는 기본 화면입니다.")),
                        "log", Map.of(
                                        "system",
                                        new SystemPageMeta("M_ADM_03_01", "M_ADM_03", "시스템로그조회", "/system/log/system",
                                                        "시스템 이벤트 및 오류 로그를 조회하는 기본 화면입니다."),
                                        "audit",
                                        new SystemPageMeta("M_ADM_03_02", "M_ADM_03", "감사추적관리", "/system/log/audit",
                                                        "사용자 행위 및 권한 변경 이력을 추적하는 기본 화면입니다.")),
                        "backup", Map.of(
                                        "policy",
                                        new SystemPageMeta("M_ADM_04_01", "M_ADM_04", "백업정책관리", "/system/backup/policy",
                                                        "백업 주기 및 보관 정책을 설정하는 기본 화면입니다."),
                                        "history",
                                        new SystemPageMeta("M_ADM_04_02", "M_ADM_04", "복구이력관리",
                                                        "/system/backup/history",
                                                        "복구 실행 이력과 결과를 확인하는 기본 화면입니다.")));

        private void addSystemPageAttributes(Model model) {
                model.addAttribute("submenu", "Y");
        }

        @GetMapping
        public String index(Model model) {
                model.addAttribute("pageTitle", "시스템관리");
                return "system/index";
        }

        @GetMapping("/{category}/{page}")
        public String systemPage(@PathVariable("category") String category, @PathVariable("page") String page,
                        Model model) {
                addSystemPageAttributes(model);

                Map<String, SystemPageMeta> categoryPages = SYSTEM_PAGE_META.get(category);
                if (categoryPages == null) {
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "잘못된 시스템 카테고리입니다.");
                }

                SystemPageMeta meta = categoryPages.get(page);
                if (meta == null) {
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "잘못된 시스템 페이지입니다.");
                }

                model.addAttribute("pageTitle", meta.pageName());
                model.addAttribute("pageDescription", meta.description());
                model.addAttribute("pagePath", meta.path());
                model.addAttribute("menuId", meta.menuId());
                model.addAttribute("parentMenuId", meta.parentMenuId());
                model.addAttribute("topMenuId", "M_ADM");

                return "system/" + category + "/" + page;
        }

        private record SystemPageMeta(String menuId, String parentMenuId, String pageName, String path,
                        String description) {
        }
}
