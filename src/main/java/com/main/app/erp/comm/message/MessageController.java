package com.main.app.erp.comm.message;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.comm.message.dto.MessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpMessageController")
@RequestMapping("/api/erp/comm/message")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService commMessageService;

    @GetMapping
    public ApiResponse<Page<MessageDto.Message>> getMessageList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(commMessageService.getMessageList(page, keyword));
    }
}

