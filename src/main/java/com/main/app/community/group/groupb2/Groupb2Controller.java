package com.main.app.community.group.groupb2;

import com.main.app.common.dto.ApiResponse;
import com.main.app.community.group.groupb2.dto.Groupb2Dto;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller("communityGroupGroupb2Controller")
public class Groupb2Controller {

    private final Groupb2Service groupb2Service;

    public Groupb2Controller(Groupb2Service groupb2Service) {
        this.groupb2Service = groupb2Service;
    }

    @GetMapping("/community/group/groupb2")
    public String groupb2Page(Model model) {
        model.addAttribute("submenu", "Y");
        return "community/group/groupb2";
    }

    @GetMapping("/api/community/group/b2")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getGroupB2(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        Page<Groupb2Dto> data = groupb2Service.getList(page, size, keyword);
        return ApiResponse.ok(Map.of(
                "content", data.getContent(),
                "totalElements", data.getTotalElements(),
                "totalPages", data.getTotalPages(),
                "number", data.getNumber(),
                "size", data.getSize()));
    }
}