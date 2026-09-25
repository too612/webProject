package com.main.app.common.chatbot.provider;

import com.main.app.common.chatbot.ChatbotDataProvider;
import com.main.app.official.news.eventcalendar.EventCalendarService;
import com.main.app.official.news.eventcalendar.dto.EventCalendarDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class EventCalendarProvider implements ChatbotDataProvider {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        private static final Pattern MONTH_PATTERN =
            Pattern.compile("(?<!\\d)(1[0-2]|[1-9])월", Pattern.CANON_EQ);

    private final EventCalendarService eventCalendarService;

    @Override
    public String intentCode() {
        return "EVENT_CALENDAR";
    }

    @Override
    public Map<String, String> resolve(String message) {
        List<EventCalendarDto> events = eventCalendarService.getList();
        Map<String, String> slots = new LinkedHashMap<>();
        if (events == null || events.isEmpty()) {
            slots.put("event_items", "등록된 행사 일정이 없습니다.");
            return slots;
        }

        List<EventCalendarDto> filteredEvents = filterEvents(events, message);
        StringBuilder result = new StringBuilder();
        filteredEvents.stream()
                .filter(event -> event != null && event.getStartDtm() != null)
                .sorted((left, right) -> left.getStartDtm().compareTo(right.getStartDtm()))
                .limit(10)
                .forEach(event -> result.append("- ")
                        .append(event.getStartDtm().format(DATE_FORMAT)).append(" ")
                        .append(event.getTitle())
                        .append(event.getLocationNm() == null ? "" : " (" + event.getLocationNm() + ")")
                        .append("\n"));
        slots.put("event_items", result.isEmpty()
                ? "조건에 맞는 행사 일정이 없습니다."
                : result.toString().trim());
        return slots;
    }

    private List<EventCalendarDto> filterEvents(List<EventCalendarDto> events, String message) {
        Integer month = extractMonth(message);
        String target = message == null ? "" : message;
        return events.stream()
                .filter(event -> event != null && event.getStartDtm() != null)
                .filter(event -> month == null || event.getStartDtm().getMonthValue() == month)
                .filter(event -> matchesTarget(event, target))
                .toList();
    }

    private Integer extractMonth(String message) {
        if (message == null) {
            return null;
        }
        Matcher matcher = MONTH_PATTERN.matcher(message);
        return matcher.find() ? Integer.valueOf(matcher.group(1)) : null;
    }

    private boolean matchesTarget(EventCalendarDto event, String message) {
        if (!message.contains("주일학교")) {
            return true;
        }
        return contains(event.getTitle(), "주일학교")
                || contains(event.getCategoryName(), "주일학교")
                || contains(event.getDescription(), "주일학교");
    }

    private boolean contains(String value, String target) {
        return value != null && value.contains(target);
    }
}