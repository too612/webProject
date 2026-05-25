package com.main.app.erp.admin.archive;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.admin.archive.dto.ArchiveDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpArchiveController")
@RequestMapping("/api/erp/admin/archive")
@RequiredArgsConstructor
public class ArchiveController {

    private final ArchiveService adminArchiveService;

    @GetMapping
    public ApiResponse<Page<ArchiveDto.Archive>> getArchiveList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(adminArchiveService.getArchiveList(page, keyword));
    }
}

