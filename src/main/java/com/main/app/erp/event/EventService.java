package com.main.app.erp.event;

import com.main.app.common.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service("erpEventService")
@RequiredArgsConstructor
public class EventService {

    private final EventMapper eventMapper;

    public List<EventDto.Event> getCalendarEvents(String year, String month) {
        return eventMapper.selectCalendarEvents(year, month);
    }

    public Page<EventDto.Apply> getApplyList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<EventDto.Apply> list = eventMapper.selectApplyList(keyword, offset, limit);
        long total = eventMapper.countApplyList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<EventDto.Apply> getParticipantList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<EventDto.Apply> list = eventMapper.selectParticipantList(keyword, offset, limit);
        long total = eventMapper.countParticipantList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<EventDto.Event> getResultList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<EventDto.Event> list = eventMapper.selectResultList(keyword, offset, limit);
        long total = eventMapper.countResultList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}
