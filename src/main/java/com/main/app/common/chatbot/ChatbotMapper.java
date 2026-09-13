package com.main.app.common.chatbot;

import com.main.app.common.chatbot.dto.ChatbotKnowledgeDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ChatbotMapper {

    List<ChatbotKnowledgeDto> selectEnabledKnowledge();
}
