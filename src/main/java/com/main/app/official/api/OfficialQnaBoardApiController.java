package com.main.app.official.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.controller.AbstractBoardController;
import com.main.app.common.helper.BoardContext;

@RestController
@RequestMapping("/api/support/qna")
public class OfficialQnaBoardApiController extends AbstractBoardController {

    @Override
    protected BoardContext getBoardContext() {
        return BoardContext.QNA;
    }
}
