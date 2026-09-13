package com.main.app.common.chatbot.dto;

import lombok.Data;

import java.util.List;

@Data
public class ChatbotResponse {
    private String reply;
    private List<String> suggestions;
    private String menuPath;
}
