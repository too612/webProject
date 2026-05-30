package com.main.app.common.corp;

import com.main.app.common.corp.dto.CorpDto;
import com.main.app.common.dto.ApiResponse;
import com.main.app.common.util.ClientIpUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/common/corp")
@RequiredArgsConstructor
public class CorpController {

    private final CorpService corpService;

    @GetMapping("/getCorpInfo")
    public ApiResponse<CorpDto> getCorpInfo(HttpServletRequest request) {
        String sessIp = ClientIpUtil.resolveClientIp(request);
        return ApiResponse.ok(corpService.getCorpInfo(sessIp));
    }
}