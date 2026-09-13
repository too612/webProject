package com.main.app.official.news.eventcalendar;

import com.main.app.common.util.ClientIpUtil;
import com.main.app.official.news.eventcalendar.dto.EventCalendarDto;
import com.main.app.official.news.eventcalendar.dto.EventCalendarRequest;
import com.main.app.official.news.eventcalendar.dto.EventCategoryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventCalendarService {

    private final EventCalendarMapper eventCalendarMapper;

    @Transactional(readOnly = true)
    public List<EventCalendarDto> getList() {
        return eventCalendarMapper.selectEventList();
    }

    @Transactional(readOnly = true)
    public List<EventCategoryDto> getCategoryList() {
        return eventCalendarMapper.selectCategoryList();
    }

    @Transactional
    public void setCreate(EventCalendarRequest request) {
        validate(request);
        normalize(request);
        request.setUpdatedBy("system");
        request.setUpdatedIp(getClientIp());
        if (eventCalendarMapper.insertEvent(request) != 1) {
            throw new IllegalArgumentException("행사 일정 등록에 실패했습니다.");
        }
    }

    @Transactional
    public void setUpdate(String eventKey, EventCalendarRequest request) {
        validate(request);
        normalize(request);
        request.setEventKey(eventKey);
        request.setUpdatedBy("system");
        request.setUpdatedIp(getClientIp());
        if (eventCalendarMapper.updateEvent(request) != 1) {
            throw new IllegalArgumentException("행사 일정 수정에 실패했습니다.");
        }
    }

    @Transactional
    public void delRemove(String eventKey) {
        if (eventCalendarMapper.softDeleteEvent(eventKey) != 1) {
            throw new IllegalArgumentException("행사 일정 삭제에 실패했습니다.");
        }
    }

    private void validate(EventCalendarRequest request) {
        if (!StringUtils.hasText(request.getTitle())) {
            throw new IllegalArgumentException("행사 제목을 입력해주세요.");
        }
        if (!StringUtils.hasText(request.getCategoryCd())) {
            throw new IllegalArgumentException("행사 구분을 선택해주세요.");
        }
        if (request.getStartDtm() == null || request.getEndDtm() == null) {
            throw new IllegalArgumentException("시작/종료 일시를 입력해주세요.");
        }
        if (request.getEndDtm().isBefore(request.getStartDtm())) {
            throw new IllegalArgumentException("종료 일시는 시작 일시보다 늦어야 합니다.");
        }
    }

    private void normalize(EventCalendarRequest request) {
        if (!StringUtils.hasText(request.getAllDayYn())) {
            request.setAllDayYn("N");
        }
        if (!StringUtils.hasText(request.getColorCd())) {
            request.setColorCd("indigo");
        }
    }

    private String getClientIp() {
        try {
            ServletRequestAttributes attributes =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                return ClientIpUtil.resolveClientIp(request);
            }
        } catch (Exception ignored) {
            // fall through to default
        }
        return "127.0.0.1";
    }
}
