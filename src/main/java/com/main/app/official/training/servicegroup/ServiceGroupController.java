package com.main.app.official.training.servicegroup;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.training.servicegroup.dto.ServiceGroupDto;
import com.main.app.official.training.servicegroup.dto.ServiceGroupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/official/training/servicegroup")
@RequiredArgsConstructor
public class ServiceGroupController {

    private final ServiceGroupService serviceGroupService;

    @GetMapping
    public ApiResponse<ServiceGroupDto> getServiceGroup() {
        return ApiResponse.ok(serviceGroupService.getServiceGroup());
    }

    @PostMapping
    public ApiResponse<Void> createServiceGroup(@RequestBody ServiceGroupRequest request) throws Exception {
        serviceGroupService.createServiceGroup(request);
        return ApiResponse.ok(null, "섬기는 공동체 정보를 등록했습니다.");
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> updateServiceGroup(@PathVariable Long id, @RequestBody ServiceGroupRequest request) throws Exception {
        serviceGroupService.updateServiceGroup(id, request);
        return ApiResponse.ok(null, "섬기는 공동체 정보를 수정했습니다.");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteServiceGroup(@PathVariable Long id) throws Exception {
        serviceGroupService.deleteServiceGroup(id);
        return ApiResponse.ok(null, "섬기는 공동체 정보를 삭제했습니다.");
    }
}