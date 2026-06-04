package com.main.app.official.about.pastor;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.about.pastor.dto.PastorDto;
import com.main.app.official.about.pastor.dto.PastorRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/official/about/pastor")
@RequiredArgsConstructor
public class PastorController {

    private final PastorService pastorService;

    @GetMapping("/getInfo")
    public ApiResponse<PastorDto> getInfo() {
        return ApiResponse.ok(pastorService.getInfo());
    }

    @PostMapping(value = "/setCreate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Void> setCreate(
            @RequestPart("request") PastorRequest request,
            @RequestPart(name = "files", required = false) List<MultipartFile> files) throws Exception {
        pastorService.setCreate(request, files);
        return ApiResponse.ok(null, "담임목사 정보를 등록했습니다.");
    }

    @PutMapping(value = "/setUpdate/{corpId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Void> setUpdate(
            @PathVariable Long corpId,
            @RequestPart("request") PastorRequest request,
            @RequestPart(name = "files", required = false) List<MultipartFile> files)
            throws Exception {
        pastorService.setUpdate(corpId, request, files);
        return ApiResponse.ok(null, "담임목사 정보를 수정했습니다.");
    }

    @DeleteMapping("/delRemove/{corpId}")
    public ApiResponse<Void> delRemove(
            @PathVariable Long corpId,
            @RequestParam(required = false) String updatedBy) throws Exception {
        pastorService.delRemove(corpId, updatedBy);
        return ApiResponse.ok(null, "담임목사 정보를 삭제했습니다.");
    }
}
