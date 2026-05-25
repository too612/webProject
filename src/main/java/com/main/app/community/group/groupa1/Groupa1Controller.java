package com.main.app.community.group.groupa1;

import com.main.app.common.dto.ApiResponse;
import com.main.app.community.group.groupa1.dto.Groupa1Dto;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller("communityGroupGroupa1Controller")
public class Groupa1Controller {

    private final Groupa1Service groupa1Service;

    public Groupa1Controller(Groupa1Service groupa1Service) {
        this.groupa1Service = groupa1Service;
    }

    @GetMapping("/community/group/groupa1")
    public String groupa1Page(Model model) {
        model.addAttribute("submenu", "Y");
        return "community/group/groupa1";
    }

    @GetMapping("/api/community/group/a1")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getGroupA1(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        Page<Groupa1Dto> data = groupa1Service.getList(page, size, keyword);
        return ApiResponse.ok(Map.of(
                "content", data.getContent(),
                "totalElements", data.getTotalElements(),
                "totalPages", data.getTotalPages(),
                "number", data.getNumber(),
                "size", data.getSize()));
    }
}