package com.main.app.common.chatbot;

import com.main.app.common.chatbot.dto.ChatbotRequest;
import com.main.app.common.chatbot.dto.ChatbotResponse;
import com.main.app.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/common/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/message")
    public ApiResponse<ChatbotResponse> message(@RequestBody ChatbotRequest request) {
        return ApiResponse.ok(chatbotService.reply(request));
    }
}
