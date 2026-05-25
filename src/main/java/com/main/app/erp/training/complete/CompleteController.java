package com.main.app.erp.training.complete;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.training.complete.dto.CompleteDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpTrainingCompleteController")
@RequestMapping("/api/erp/training/complete")
@RequiredArgsConstructor
public class CompleteController {

    private final CompleteService completeService;

    @GetMapping
    public ApiResponse<Page<CompleteDto.Complete>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(completeService.getCompleteList(page, keyword));
    }
}
