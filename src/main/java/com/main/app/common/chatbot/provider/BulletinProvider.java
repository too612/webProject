package com.main.app.common.chatbot.provider;

import com.main.app.common.chatbot.ChatbotDataProvider;
import com.main.app.official.index.OfficialIndexService;
import com.main.app.official.index.dto.OfficialIndexDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class BulletinProvider implements ChatbotDataProvider {

    private final OfficialIndexService officialIndexService;

    @Override
    public String intentCode() {
        return "BULLETIN";
    }

    @Override
    public Map<String, String> resolve(String message) {
        Map<String, String> slots = new LinkedHashMap<>();
        List<OfficialIndexDto.Item> items = officialIndexService.getIndexData().getRecentBulletins();
        if (items == null || items.isEmpty()) {
            slots.put("bulletin_items", "아직 등록된 주보가 없습니다.");
            return slots;
        }
        StringBuilder sb = new StringBuilder();
        for (OfficialIndexDto.Item item : items) {
            sb.append("- ").append(item.getDate() == null ? "" : item.getDate())
                    .append(" ").append(item.getTitle()).append("\n");
        }
        slots.put("bulletin_items", sb.toString().trim());
        return slots;
    }
}
