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
public class NoticeProvider implements ChatbotDataProvider {

    private final OfficialIndexService officialIndexService;

    @Override
    public String intentCode() {
        return "NOTICE";
    }

    @Override
    public Map<String, String> resolve(String message) {
        Map<String, String> slots = new LinkedHashMap<>();
        List<OfficialIndexDto.Item> items = officialIndexService.getIndexData().getRecentAnnouncements();
        if (items == null || items.isEmpty()) {
            slots.put("notice_items", "아직 등록된 공지사항이 없습니다.");
            return slots;
        }
        StringBuilder sb = new StringBuilder();
        for (OfficialIndexDto.Item item : items) {
            sb.append("- ").append(item.getDate() == null ? "" : item.getDate())
                    .append(" ").append(item.getTitle()).append("\n");
        }
        slots.put("notice_items", sb.toString().trim());
        return slots;
    }
}
