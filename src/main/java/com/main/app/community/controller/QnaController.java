package com.main.app.community.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.main.app.common.controller.AbstractBoardController;
import com.main.app.common.helper.BoardContext;

@Controller("communityBoardQnaController")
@RequestMapping("/community/board")
public class QnaController extends AbstractBoardController {

    @Override
    protected BoardContext getBoardContext() {
        return BoardContext.COMMUNITY_QNA;
    }
}
