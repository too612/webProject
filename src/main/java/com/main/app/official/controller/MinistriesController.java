package com.main.app.official.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.main.app.common.controller.AbstractBoardController;
import com.main.app.common.helper.BoardContext;

@Controller
@RequestMapping("/ministries")
public class MinistriesController {

    @Controller
    @RequestMapping("/ministries/children")
    public static class ChildrenController extends AbstractBoardController {

        @Override
        protected BoardContext getBoardContext() {
            return BoardContext.CHILDREN;
        }
    }

    @Controller
    @RequestMapping("/ministries/youth")
    public static class YouthController extends AbstractBoardController {

        @Override
        protected BoardContext getBoardContext() {
            return BoardContext.YOUTH;
        }
    }

    @Controller
    @RequestMapping("/ministries/mission")
    public static class MissionController extends AbstractBoardController {

        @Override
        protected BoardContext getBoardContext() {
            return BoardContext.MISSION;
        }
    }
}
