package com.main.app.official.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.main.app.common.controller.AbstractBoardController;
import com.main.app.common.helper.BoardContext;

@Controller
@RequestMapping("/news")
public class NewsController {

    /**
     * 소식/공지 페이지들의 공통 모델 속성을 설정합니다.
     * GlobalControllerAdvice에서 이미 모든 메뉴 관련 정보를 처리하므로
     * 여기서는 submenu 플래그만 설정합니다.
     *
     * @param model 뷰에 전달할 모델 객체
     */
    private void addNewsPageAttributes(Model model) {
        // submenu 사용 플래그 설정 - 이것만으로도 레이아웃에서 submenu 영역이 표시됩니다
        model.addAttribute("submenu", "Y");

        // 추가적인 페이지별 설정이 필요한 경우 여기에 추가
        // 예: model.addAttribute("pageType", "news");
    }

    @GetMapping("/event")
    public String eventPage(Model model) {
        addNewsPageAttributes(model);

        return "official/news/event";
    }

    // 향후 news 관련 페이지가 추가될 경우,
    // 동일한 패턴으로 메소드를 추가하면 됩니다.

    @Controller
    @RequestMapping("/news/announcement")
    public static class AnnouncementController extends AbstractBoardController {

        @Override
        protected BoardContext getBoardContext() {
            return BoardContext.ANNOUNCEMENT;
        }
    }

    @Controller
    @RequestMapping("/news/bulletin")
    public static class BulletinController extends AbstractBoardController {

        @Override
        protected BoardContext getBoardContext() {
            return BoardContext.BULLETIN;
        }
    }

    @Controller
    @RequestMapping("/news/registration")
    public static class RegistrationController extends AbstractBoardController {

        @Override
        protected BoardContext getBoardContext() {
            return BoardContext.REGISTRATION;
        }
    }
}
