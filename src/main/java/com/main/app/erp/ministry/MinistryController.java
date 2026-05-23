package com.main.app.erp.ministry;

import com.main.app.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController("erpMinistryController")
@RequestMapping("/api/erp/ministry")
@RequiredArgsConstructor
public class MinistryController {

    private final MinistryService ministryService;

    @GetMapping("/department")
    public ApiResponse<Page<MinistryDto.Department>> department(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(ministryService.getDepartmentList(page, keyword));
    }

    @GetMapping("/schedule")
    public ApiResponse<Page<MinistryDto.Schedule>> schedule(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(ministryService.getScheduleList(page, keyword));
    }

    @GetMapping("/volunteer")
    public ApiResponse<Page<MinistryDto.Volunteer>> volunteer(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(ministryService.getVolunteerList(page, keyword));
    }

    @GetMapping("/report")
    public ApiResponse<Page<MinistryDto.Report>> report(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(ministryService.getReportList(page, keyword));
    }
}
