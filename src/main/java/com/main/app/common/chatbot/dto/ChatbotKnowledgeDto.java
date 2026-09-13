package com.main.app.common.chatbot.dto;

import lombok.Data;

@Data
public class ChatbotKnowledgeDto {
    private Long knowledgeId;
    private String intentCode;
    private String keywords;
    private String answerTemplate;
    private Integer priority;
    private String menuPath;
    private String suggestions;
}
