package com.main.app.community.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.controller.AbstractBoardController;
import com.main.app.common.helper.BoardContext;

@RestController
@RequestMapping("/api/community/support/qna")
public class CommunityQnaBoardApiController extends AbstractBoardController {

    @Override
    protected BoardContext getBoardContext() {
        return BoardContext.COMMUNITY_QNA;
    }
}
