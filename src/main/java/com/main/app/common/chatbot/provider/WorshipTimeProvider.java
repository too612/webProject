package com.main.app.common.chatbot.provider;

import com.main.app.common.chatbot.ChatbotDataProvider;
import com.main.app.official.worship.time.TimeService;
import com.main.app.official.worship.time.dto.TimeDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class WorshipTimeProvider implements ChatbotDataProvider {

    private final TimeService timeService;

    @Override
    public String intentCode() {
        return "WORSHIP_TIME";
    }

    @Override
    public Map<String, String> resolve(String message) {
        List<TimeDto> items = timeService.getTimeItems();
        Map<String, String> slots = new LinkedHashMap<>();
        if (items == null || items.isEmpty()) {
            slots.put("worship_items", "아직 등록된 예배시간 정보가 없습니다.");
            return slots;
        }

        List<TimeDto> filtered = filterByDay(items, message);
        StringBuilder sb = new StringBuilder();
        for (TimeDto item : filtered) {
            sb.append("- ").append(item.getTitle()).append(": ").append(item.getTime());
            if (item.getLocation() != null && !item.getLocation().isBlank()) {
                sb.append(" (").append(item.getLocation()).append(")");
            }
            sb.append("\n");
        }
        slots.put("worship_items", sb.toString().trim());
        return slots;
    }

    /** 질문에 요일/구분 키워드가 포함된 경우 해당 항목만 필터링한다. */
    private List<TimeDto> filterByDay(List<TimeDto> items, String message) {
        if (message == null || message.isBlank()) {
            return items;
        }
        List<String> dayWords = List.of("새벽", "주일", "월요", "화요", "수요", "목요", "금요", "토요", "성도", "모임");
        List<String> matched = new ArrayList<>();
        for (String word : dayWords) {
            if (message.contains(word)) {
                matched.add(word);
            }
        }
        if (matched.isEmpty()) {
            return items;
        }
        List<TimeDto> filtered = new ArrayList<>();
        for (TimeDto item : items) {
            for (String word : matched) {
                if ((item.getCategory() != null && item.getCategory().contains(word))
                        || (item.getTitle() != null && item.getTitle().contains(word))) {
                    filtered.add(item);
                    break;
                }
            }
        }
        return filtered.isEmpty() ? items : filtered;
    }
}
