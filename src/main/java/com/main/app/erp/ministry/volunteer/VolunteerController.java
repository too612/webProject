package com.main.app.erp.ministry.volunteer;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.ministry.volunteer.dto.VolunteerDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpMinistryVolunteerController")
@RequestMapping("/api/erp/ministry/volunteer")
@RequiredArgsConstructor
public class VolunteerController {

    private final VolunteerService volunteerService;

    @GetMapping
    public ApiResponse<Page<VolunteerDto.Volunteer>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(volunteerService.getVolunteerList(page, keyword));
    }
}
