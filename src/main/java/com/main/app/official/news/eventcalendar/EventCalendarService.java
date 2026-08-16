package com.main.app.official.news.eventcalendar;

import com.main.app.official.news.eventcalendar.dto.EventCalendarDto;
import com.main.app.official.news.eventcalendar.dto.EventCalendarRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EventCalendarService {

    private final EventCalendarMapper eventCalendarMapper;

    /**
     * 행사달력 단건 조회
     */
    @Transactional(readOnly = true)
    public EventCalendarDto getInfo() {
        return eventCalendarMapper.selectInfo();
    }

    /**
     * 행사달력 등록 (최초 1건 생성 기준)
     */
    @Transactional
    public void setCreate(EventCalendarRequest request) {
        if (eventCalendarMapper.insertInfo(request) != 1) {
            throw new IllegalArgumentException("행사달력 등록에 실패했습니다.");
        }
    }

    /**
     * 행사달력 수정
     */
    @Transactional
    public void setUpdate(Long eventCalendarId, EventCalendarRequest request) {
        request.setEventCalendarId(eventCalendarId);
        if (eventCalendarMapper.updateInfo(request) != 1) {
            throw new IllegalArgumentException("행사달력 수정에 실패했습니다.");
        }
    }

    /**
     * 행사달력 소프트 삭제
     */
    @Transactional
    public void delRemove(Long eventCalendarId) {
        if (eventCalendarMapper.softDeleteInfo(eventCalendarId) != 1) {
            throw new IllegalArgumentException("행사달력 삭제에 실패했습니다.");
        }
    }
}
