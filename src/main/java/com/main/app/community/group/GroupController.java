package com.main.app.community.group;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;
import org.springframework.data.domain.Page;
import java.util.Map;
import java.util.List;

@Controller("communityGroupController")
@RequestMapping("/community/group")
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/manager")
    public String managerPage(Model model) {
        addPageAttributes(model);
        return "community/group/manager";
    }

    @GetMapping("/groupa1")
    public String groupa1Page(Model model) {
        addPageAttributes(model);
        return "community/group/groupa1";
    }

    @GetMapping("/groupb2")
    public String groupb2Page(Model model) {
        addPageAttributes(model);
        return "community/group/groupb2";
    }

    // ===== REST API Methods =====

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
        Page<GroupDto> data = groupService.getGroupList(page, size, keyword);
        return ApiResponse.ok(Map.of(
                "content", data.getContent(),
                "totalElements", data.getTotalElements(),
                "totalPages", data.getTotalPages(),
                "number", data.getNumber(),
                "size", data.getSize()));
    }

    @GetMapping("/api/community/group/a1")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getGroupA1(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        Page<GroupDto> data = groupService.getGroupA1List(page, size, keyword);
        return ApiResponse.ok(Map.of(
                "content", data.getContent(),
                "totalElements", data.getTotalElements(),
                "totalPages", data.getTotalPages(),
                "number", data.getNumber(),
                "size", data.getSize()));
    }

    @GetMapping("/api/community/group/b2")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getGroupB2(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        Page<GroupDto> data = groupService.getGroupB2List(page, size, keyword);
        return ApiResponse.ok(Map.of(
                "content", data.getContent(),
                "totalElements", data.getTotalElements(),
                "totalPages", data.getTotalPages(),
                "number", data.getNumber(),
                "size", data.getSize()));
    }
}
