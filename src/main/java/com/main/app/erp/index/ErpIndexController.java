package com.main.app.erp.index;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.index.dto.ErpIndexDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpApiIndexController")
@RequestMapping("/api/erp/index")
@RequiredArgsConstructor
public class ErpIndexController {

    private final ErpIndexService erpIndexService;

    @GetMapping
    public ApiResponse<ErpIndexDto> getIndexData() {
        return ApiResponse.ok(erpIndexService.getIndexData());
    }
}
