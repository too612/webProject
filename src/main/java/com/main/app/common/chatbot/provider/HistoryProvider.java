package com.main.app.common.chatbot.provider;

import com.main.app.common.chatbot.ChatbotDataProvider;
import com.main.app.official.about.history.HistoryService;
import com.main.app.official.about.history.dto.HistoryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class HistoryProvider implements ChatbotDataProvider {

    private static final int LATEST_EVENT_COUNT = 5;

    private final HistoryService historyService;

    @Override
    public String intentCode() {
        return "CHURCH_INTRO";
    }

    @Override
    public Map<String, String> resolve(String message) {
        Map<String, String> slots = new LinkedHashMap<>();
        HistoryDto history = historyService.getHistory();
        if (history == null || history.getTimeline() == null || history.getTimeline().isEmpty()) {
            slots.put("history_items", "아직 등록된 교회 연혁 정보가 없습니다.");
            return slots;
        }

        StringBuilder sb = new StringBuilder();
        sb.append("[최근 주요 연혁]");

        int count = 0;
        outer:
        for (HistoryDto.TimelineItem item : history.getTimeline()) {
            if (item.getEvents() == null) {
                continue;
            }
            for (HistoryDto.EventItem event : item.getEvents()) {
                sb.append("\n- ").append(item.getYear()).append(" ").append(event.getDate())
                        .append(": ").append(event.getDescription());
                count++;
                if (count >= LATEST_EVENT_COUNT) {
                    break outer;
                }
            }
        }
        sb.append("\n\n전체 연혁은 연혁 페이지에서 확인하실 수 있습니다.");
        slots.put("history_items", sb.toString().trim());
        return slots;
    }
}
