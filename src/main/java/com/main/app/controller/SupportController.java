package com.main.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/support")
public class SupportController {
    
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
    public String getQna(Model model) {
        model.addAttribute("currentMenu", "고객지원");
        model.addAttribute("currentSubmenu", "Q&A");
        return "support/qna";
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