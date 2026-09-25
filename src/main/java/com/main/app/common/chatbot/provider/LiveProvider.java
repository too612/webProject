package com.main.app.common.chatbot.provider;

import com.main.app.common.chatbot.ChatbotDataProvider;
import com.main.app.official.worship.live.LiveService;
import com.main.app.official.worship.live.dto.LiveDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class LiveProvider implements ChatbotDataProvider {

    private final LiveService liveService;

    @Override
    public String intentCode() {
        return "LIVE";
    }

    @Override
    public Map<String, String> resolve(String message) {
        List<LiveDto> items = liveService.getLiveItems(null);
        Map<String, String> slots = new LinkedHashMap<>();
        if (items == null || items.isEmpty()) {
            slots.put("live_items", "현재 안내할 온라인 예배 영상이 없습니다.");
            return slots;
        }

        StringBuilder result = new StringBuilder();
        for (LiveDto item : items.stream().limit(5).toList()) {
            result.append("- ").append(item.getTitle()).append("\n");
        }
        slots.put("live_items", result.toString().trim());
        return slots;
    }
}