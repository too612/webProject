package com.main.app.common.chatbot.provider;

import com.main.app.official.worship.time.TimeService;
import com.main.app.official.worship.time.dto.TimeDto;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class WorshipTimeProviderTest {

    @Test
    void filtersByRequestedHour() {
        TimeService service = mock(TimeService.class);
        when(service.getTimeItems()).thenReturn(List.of(
                item("새벽예배", "새벽기도회", "매일 오전 5시"),
                item("주일예배", "주일저녁 찬양예배", "주일 오후 7시")));

        String reply = new WorshipTimeProvider(service).resolve("7시 예배 있어?").get("worship_items");

        assertTrue(reply.contains("주일저녁 찬양예배"));
        assertTrue(!reply.contains("새벽기도회"));
    }

    @Test
    void filtersDawnPrayerByDayCategory() {
        TimeService service = mock(TimeService.class);
        when(service.getTimeItems()).thenReturn(List.of(
                item("새벽예배", "새벽기도회", "매일 오전 5시"),
                item("주일예배", "주일오전 축제예배", "주일 오전 11시")));

        String reply = new WorshipTimeProvider(service).resolve("새벽기도 언제야?").get("worship_items");

        assertTrue(reply.contains("새벽기도회"));
        assertTrue(!reply.contains("주일오전 축제예배"));
    }

    @Test
    void reportsWhenRequestedHourDoesNotExist() {
        TimeService service = mock(TimeService.class);
        when(service.getTimeItems()).thenReturn(List.of(item("새벽예배", "새벽기도회", "매일 오전 5시")));

        String reply = new WorshipTimeProvider(service).resolve("8시 예배 있어?").get("worship_items");

        assertTrue(reply.contains("8시에 등록된 예배가 없습니다."));
    }

    private TimeDto item(String category, String title, String time) {
        TimeDto item = new TimeDto();
        item.setCategory(category);
        item.setTitle(title);
        item.setTime(time);
        return item;
    }
}