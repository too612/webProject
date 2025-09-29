package com.main.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.main.app.service.BoardService;
import com.main.app.model.Board;
import java.util.List;

@Controller
@RequestMapping("/support")
public class SupportController {
    
    @Autowired
    private BoardService boardService;

    @GetMapping("/notice")
    public String getNotice(Model model) {
        model.addAttribute("currentMenu", "고객지원");
        model.addAttribute("currentSubmenu", "공지사항");
        return "support/notice";
    }

    @GetMapping("/faq")
    public String getFaq(Model model) {
        model.addAttribute("currentMenu", "고객지원");
        model.addAttribute("currentSubmenu", "FAQ");
        return "support/faq";
    }
    @GetMapping("/qna")
    public String getQna(Model model,
                         @RequestParam(value = "page", defaultValue = "0") int page,
                         @RequestParam(value = "searchType", required = false) String searchType,
                         @RequestParam(value = "keyword", required = false) String keyword) {

        // rqstNo를 기준으로 내림차순 정렬 (최신순)
        Pageable pageable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "rqstNo"));
        Page<Board> paging;

        if (keyword != null && !keyword.trim().isEmpty()) {
            paging = boardService.searchBoards(searchType, keyword, pageable);
        } else {
            paging = boardService.getBoards(pageable); // getAllBoards() -> getBoards(pageable)
        }
        model.addAttribute("currentMenu", "고객지원");
        model.addAttribute("currentSubmenu", "Q&A");
        model.addAttribute("paging", paging);
        model.addAttribute("boards", paging.getContent());
        return "support/qna";
    }

    @GetMapping("/qna/write")
    public String qnaWriteForm(Model model, @RequestParam(value = "rqstNo", required = false) String rqstNo) {
        model.addAttribute("currentMenu", "고객지원");
        model.addAttribute("currentSubmenu", "Q&A");
        model.addAttribute("submenu", "Y");
        
        if (rqstNo != null) {
            Board board = boardService.getBoard(rqstNo);
            model.addAttribute("board", board);
        } else {
            model.addAttribute("board", new Board()); // 새로운 게시글 작성을 위한 빈 객체
        }
        return "support/qnaWrite";
    }

    @PostMapping("/qna/write")
    public String saveQna(Board board, RedirectAttributes redirectAttributes) {
        boardService.saveBoard(board);
        redirectAttributes.addFlashAttribute("message", "게시글이 성공적으로 저장되었습니다.");
        return "redirect:/support/qna";
    }

    @PostMapping("/qna/delete")
    public String deleteQna(@RequestParam("rqstNo") String rqstNo, RedirectAttributes redirectAttributes) {
        boardService.deleteBoard(rqstNo);
        redirectAttributes.addFlashAttribute("message", "게시글이 삭제되었습니다.");
        return "redirect:/support/qna";
    }

    @PostMapping("/qna/update")
    public String updateQna(Board board, RedirectAttributes redirectAttributes) {
        boardService.saveBoard(board); // saveBoard가 내부적으로 insert/update를 처리
        redirectAttributes.addFlashAttribute("message", "게시글이 수정되었습니다.");
        return "redirect:/support/qna";
    }

    @GetMapping("/download")
    public String getDownload(Model model) {
        model.addAttribute("currentMenu", "고객지원");
        model.addAttribute("currentSubmenu", "자료실");
        return "support/download";
    }
    @GetMapping("/board")
    public String getBoard(Model model) {
        model.addAttribute("currentMenu", "고객지원");
        model.addAttribute("currentSubmenu", "게시판");
        return "support/board";
    }
}