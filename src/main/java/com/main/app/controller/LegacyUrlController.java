package com.main.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LegacyUrlController {

    @GetMapping("/support/qna")
    public String redirectQna() {
        return "redirect:/board";
    }
}