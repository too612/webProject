package com.main.app.system.user;

import com.main.app.common.dto.ApiResponse;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller("systemUserController")
@RequestMapping("/system/user")
public class UserController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/manager")
    public String managerPage(Model model) {
        addPageAttributes(model);
        return "system/user/manager";
    }

    @GetMapping("/role")
    public String rolePage(Model model) {
        addPageAttributes(model);
        return "system/user/role";
    }

    // ===== REST API 메서드 =====

    /**
     * API 사용자 목록 조회
     */
    @GetMapping("/api/user/list")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getUserList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size));
    }

    /**
     * API 권한 목록 조회
     */
    @GetMapping("/api/user/roles")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getRoleList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size));
    }
}
