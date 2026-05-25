package com.main.app.erp.sermon.archive;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.sermon.archive.dto.ArchiveDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpSermonArchiveController")
@RequestMapping("/api/erp/sermon/archive")
@RequiredArgsConstructor
public class ArchiveController {

    private final ArchiveService archiveService;

    @GetMapping
    public ApiResponse<Page<ArchiveDto.Archive>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(archiveService.getArchiveList(page, keyword));
    }
}
