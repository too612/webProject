package com.main.app.erp.humen.organization;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.humen.organization.dto.OrganizationDto;
import com.main.app.erp.humen.organization.dto.OrganizationRequest;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController("erpHumenOrganizationController")
@RequestMapping("/api/erp/humen/organization")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    @GetMapping
    public ApiResponse<Page<OrganizationDto.Reorg>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(organizationService.getReorgList(page, size, keyword));
    }

    @GetMapping("/{reorgKey}")
    public ApiResponse<OrganizationDto.ReorgDetail> detail(@PathVariable String reorgKey) {
        return ApiResponse.ok(organizationService.getReorg(reorgKey));
    }

    @GetMapping("/active")
    public ApiResponse<OrganizationDto.ReorgDetail> active(
            @RequestParam(required = false) String baseDate) {
        return ApiResponse.ok(organizationService.getActiveReorg(baseDate));
    }

    @PostMapping
    public ApiResponse<OrganizationDto.ReorgDetail> create(
            @RequestBody OrganizationRequest.ReorgCreate request, HttpServletRequest servletRequest) {
        return ApiResponse.ok(organizationService.createReorg(request, userId(servletRequest)),
                "조직개편안을 등록했습니다.");
    }

    @PostMapping("/{reorgKey}/departments")
    public ApiResponse<Void> addDepartment(@PathVariable String reorgKey,
            @RequestBody OrganizationRequest.DepartmentCreate request, HttpServletRequest servletRequest) {
        organizationService.addDepartment(reorgKey, request, userId(servletRequest));
        return ApiResponse.ok(null, "부서를 추가했습니다.");
    }

    @PutMapping("/{reorgKey}/departments/{deptKey}")
    public ApiResponse<Void> updateDepartment(@PathVariable String reorgKey,
            @PathVariable String deptKey, @RequestBody OrganizationRequest.DepartmentUpdate request,
            HttpServletRequest servletRequest) {
        organizationService.updateDepartment(reorgKey, deptKey, request, userId(servletRequest));
        return ApiResponse.ok(null, "부서를 수정했습니다.");
    }

    @PutMapping("/{reorgKey}/departments/{deptKey}/parent")
    public ApiResponse<Void> changeParent(@PathVariable String reorgKey,
            @PathVariable String deptKey, @RequestParam(required = false) String parentDeptKey,
            HttpServletRequest servletRequest) {
        organizationService.changeParent(reorgKey, deptKey, parentDeptKey, userId(servletRequest));
        return ApiResponse.ok(null, "상위 부서를 변경했습니다.");
    }

    @PutMapping("/{reorgKey}/departments/{deptKey}/placement")
    public ApiResponse<Void> moveDepartment(@PathVariable String reorgKey,
            @PathVariable String deptKey, @RequestBody OrganizationRequest.DepartmentPlacement request,
            HttpServletRequest servletRequest) {
        organizationService.moveDepartment(reorgKey, deptKey, request, userId(servletRequest));
        return ApiResponse.ok(null, "부서 위치를 변경했습니다.");
    }

    @DeleteMapping("/{reorgKey}/departments/{deptKey}")
    public ApiResponse<Void> removeDepartment(@PathVariable String reorgKey,
            @PathVariable String deptKey, HttpServletRequest servletRequest) {
        organizationService.removeDepartment(reorgKey, deptKey, userId(servletRequest));
        return ApiResponse.ok(null, "부서를 비활성화했습니다.");
    }

    @PostMapping("/{reorgKey}/confirm")
    public ApiResponse<Void> confirm(@PathVariable String reorgKey, HttpServletRequest servletRequest) {
        organizationService.confirmReorg(reorgKey, userId(servletRequest));
        return ApiResponse.ok(null, "조직개편안을 확정했습니다.");
    }

    private static String userId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || !(session.getAttribute("userId") instanceof String userId) || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return userId;
    }
}
