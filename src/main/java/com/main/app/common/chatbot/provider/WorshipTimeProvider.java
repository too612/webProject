package com.main.app.common.chatbot.provider;

import com.main.app.common.chatbot.ChatbotDataProvider;
import com.main.app.common.chatbot.ChatbotTextUtil;
import com.main.app.official.worship.time.TimeService;
import com.main.app.official.worship.time.dto.TimeDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class WorshipTimeProvider implements ChatbotDataProvider {

    private static final String WORSHIP_ITEMS_SLOT = "worship_items";
    private static final String NO_WORSHIP_TIME = "아직 등록된 예배시간 정보가 없습니다.";
    private static final Pattern HOUR_PATTERN =
            Pattern.compile("(?<!\\d)(\\d{1,2})시", Pattern.CANON_EQ);

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
            slots.put(WORSHIP_ITEMS_SLOT, NO_WORSHIP_TIME);
            return slots;
        }

        List<TimeDto> filtered = filterByDay(items, message);
        Integer requestedHour = extractHour(message);
        if (requestedHour != null) {
            filtered = filtered.stream()
                    .filter(item -> containsHour(item.getTime(), requestedHour))
                    .toList();
            if (filtered.isEmpty()) {
                slots.put(WORSHIP_ITEMS_SLOT, requestedHour + "시에 등록된 예배가 없습니다.");
                return slots;
            }
        }
        StringBuilder sb = new StringBuilder();
        for (TimeDto item : filtered) {
            if (ChatbotTextUtil.isMissingValue(item.getTitle()) || ChatbotTextUtil.isMissingValue(item.getTime())) {
                continue;
            }
            sb.append("- ").append(item.getTitle()).append(": ").append(item.getTime());
            if (item.getLocation() != null && !item.getLocation().isBlank()) {
                sb.append(" (").append(item.getLocation()).append(")");
            }
            sb.append("\n");
        }
        slots.put(WORSHIP_ITEMS_SLOT, sb.isEmpty()
            ? NO_WORSHIP_TIME
                : sb.toString().trim());
        return slots;
    }

    private Integer extractHour(String message) {
        if (message == null) {
            return null;
        }
        Matcher matcher = HOUR_PATTERN.matcher(message);
        return matcher.find() ? Integer.valueOf(matcher.group(1)) : null;
    }

    private boolean containsHour(String time, int hour) {
        if (ChatbotTextUtil.isMissingValue(time)) {
            return false;
        }
        Matcher matcher = HOUR_PATTERN.matcher(time);
        while (matcher.find()) {
            if (Integer.parseInt(matcher.group(1)) == hour) {
                return true;
            }
        }
        return false;
    }

    /** 질문에 요일/구분 키워드가 포함된 경우 해당 항목만 필터링한다. */
    private List<TimeDto> filterByDay(List<TimeDto> items, String message) {
        if (message == null || message.isBlank()) {
            return items;
        }
        List<String> dayWords = List.of("새벽", "주일", "월요", "화요", "수요", "목요", "금요", "토요", "성도", "모임");
        List<String> matched = dayWords.stream()
                .filter(message::contains)
                .toList();
        if (matched.isEmpty()) {
            return items;
        }
        List<TimeDto> filtered = items.stream()
                .filter(item -> matchesDay(item, matched))
                .toList();
        return filtered.isEmpty() ? items : filtered;
    }

    private boolean matchesDay(TimeDto item, List<String> dayWords) {
        return dayWords.stream().anyMatch(word -> contains(item.getCategory(), word)
                || contains(item.getTitle(), word));
    }

    private boolean contains(String value, String target) {
        return value != null && value.contains(target);
    }
}
