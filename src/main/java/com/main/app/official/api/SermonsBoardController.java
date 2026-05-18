package com.main.app.official.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.controller.AbstractBoardController;
import com.main.app.common.helper.BoardContext;

@RestController
@RequestMapping("/api/worship/sermons")
public class SermonsBoardController extends AbstractBoardController {

    @Override
    protected BoardContext getBoardContext() {
        return BoardContext.SERMONS;
    }
}

