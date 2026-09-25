package com.main.app.common.chatbot.provider;

import com.main.app.official.news.eventcalendar.EventCalendarService;
import com.main.app.official.news.eventcalendar.dto.EventCalendarDto;
import org.junit.jupiter.api.Test;

import java.time.OffsetDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class EventCalendarProviderTest {

    @Test
    void filtersEventsByMonth() {
        EventCalendarService service = mock(EventCalendarService.class);
        when(service.getList()).thenReturn(List.of(
                event("8월 행사", "2026-08-10T10:00:00+09:00"),
                event("9월 행사", "2026-09-10T10:00:00+09:00")));

        String reply = new EventCalendarProvider(service).resolve("8월 행사 알려줘").get("event_items");

        assertTrue(reply.contains("8월 행사"));
        assertTrue(!reply.contains("9월 행사"));
    }

    @Test
    void filtersEventsForSundaySchool() {
        EventCalendarService service = mock(EventCalendarService.class);
        EventCalendarDto schoolEvent = event("주일학교 여름행사", "2026-08-10T10:00:00+09:00");
        schoolEvent.setDescription("주일학교 행사");
        when(service.getList()).thenReturn(List.of(
                schoolEvent,
                event("청년부 행사", "2026-08-11T10:00:00+09:00")));

        String reply = new EventCalendarProvider(service).resolve("주일학교 행사 알려줘").get("event_items");

        assertTrue(reply.contains("주일학교 여름행사"));
        assertTrue(!reply.contains("청년부 행사"));
    }

    private EventCalendarDto event(String title, String start) {
        EventCalendarDto event = new EventCalendarDto();
        event.setTitle(title);
        event.setStartDtm(OffsetDateTime.parse(start));
        return event;
    }
}