package com.main.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.main.app.model.Board;
import com.main.app.service.BoardService;

@Controller
public class BoardController {
    
    @Autowired
    private BoardService boardService;

    // @GetMapping("/")
    // public String index(Model model) {

    //     model.addAttribute("boards", boardService.getLatestBoards());
    //     return "index";
    // }

    @GetMapping("/board/list")
    public String boardList(Model model) {
        model.addAttribute("boards", boardService.getAllBoards());
        return "board/list";
    }

    @GetMapping("/board/{id}")
    public String boardView(@PathVariable Long id, Model model) {
        model.addAttribute("board", boardService.getBoard(id));
        return "board/view";
    }

    @PostMapping("/api/board")
    @ResponseBody
    public Board saveBoard(@RequestBody Board board) {
        return boardService.saveBoard(board);
    }
}
