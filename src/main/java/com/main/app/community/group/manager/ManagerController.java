package com.main.app.community.group.manager;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;
import com.main.app.community.group.manager.dto.ManagerDto;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller("communityGroupManagerController")
public class ManagerController {

    private final ManagerService managerService;

    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    @GetMapping("/community/group/manager")
    public String managerPage(Model model) {
        model.addAttribute("submenu", "Y");
        return "community/group/manager";
    }

    @GetMapping("/api/community/group/pages")
    @ResponseBody
    public ApiResponse<List<PageMetaDto>> getPages() {
        return ApiResponse.ok(List.of(
                new PageMetaDto("Group Manager", "/community/group/manager", "community", "community/group/manager"),
                new PageMetaDto("A1", "/community/group/groupa1", "community", "community/group/groupa1"),
                new PageMetaDto("B2", "/community/group/groupb2", "community", "community/group/groupb2")));
    }

    @GetMapping("/api/community/group/list")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getGroupList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        Page<ManagerDto> data = managerService.getList(page, size, keyword);
        return ApiResponse.ok(Map.of(
                "content", data.getContent(),
                "totalElements", data.getTotalElements(),
                "totalPages", data.getTotalPages(),
                "number", data.getNumber(),
                "size", data.getSize()));
    }
}