package com.main.app.common.chatbot.provider;

import com.main.app.common.chatbot.ChatbotDataProvider;
import com.main.app.common.chatbot.ChatbotTextUtil;
import com.main.app.official.about.pastor.PastorService;
import com.main.app.official.about.pastor.dto.PastorDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class PastorProvider implements ChatbotDataProvider {

    private final PastorService pastorService;

    @Override
    public String intentCode() {
        return "PASTOR";
    }

    @Override
    public Map<String, String> resolve(String message) {
        Map<String, String> slots = new LinkedHashMap<>();
        PastorDto pastor = pastorService.getInfo();
        if (pastor == null) {
            slots.put("chief_name", "등록된 담임목사 정보가 없습니다.");
            slots.put("introduction", "");
            return slots;
        }
        slots.put("chief_name", pastor.getChiefName() == null || pastor.getChiefName().isBlank()
                ? "등록된 담임목사 정보가 없습니다." : pastor.getChiefName());
        slots.put("introduction", condense(ChatbotTextUtil.toPlainText(pastor.getIntroduction())));
        return slots;
    }

    /** 인사말 전문 대신 핵심 문장으로 요약한다. */
    private String condense(String text) {
        if (text == null || text.isBlank()) {
            return "";
        }
        String cleaned = text.trim();
        int max = 150;
        if (cleaned.length() <= max) {
            return cleaned;
        }
        String truncated = cleaned.substring(0, max);
        int lastSentence = Math.max(truncated.lastIndexOf("."), truncated.lastIndexOf("\n"));
        if (lastSentence > max / 2) {
            return truncated.substring(0, lastSentence + 1).trim();
        }
        return truncated.trim() + "…";
    }
}
