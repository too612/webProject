package com.main.app.erp.sermon.write;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.sermon.write.dto.WriteDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpSermonWriteController")
@RequestMapping("/api/erp/sermon/write")
@RequiredArgsConstructor
public class WriteController {

    private final WriteService writeService;

    @PostMapping
    public ApiResponse<Void> create(@RequestBody WriteDto.WriteRequest request) {
        writeService.createWorship(request);
        return ApiResponse.ok(null, "설교가 등록되었습니다.");
    }
}
