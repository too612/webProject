package com.main.app.erp.account.input;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.account.input.dto.InputDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpInputController")
@RequestMapping("/api/erp/account/input")
@RequiredArgsConstructor
public class InputController {

    private final InputService accountInputService;

    @GetMapping
    public ApiResponse<Page<InputDto.Offering>> getInputList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(accountInputService.getInputList(page, keyword));
    }
}
