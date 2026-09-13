package com.main.app.official.worship.time;

import com.main.app.official.worship.time.dto.TimeDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("officialWorshipTimeService")
@RequiredArgsConstructor
public class TimeService {

    private final TimeMapper timeMapper;

    @Transactional(readOnly = true)
    public List<TimeDto> getTimeItems() {
        return timeMapper.selectTimeItems();
    }

    /**
     * 예배시간 전체 저장 (전체 교체)
     */
    @Transactional
    public void setCreate(List<TimeDto> items) {
        saveInternal(items);
    }

    @Transactional
    public void setUpdate(List<TimeDto> items) {
        saveInternal(items);
    }

    private void saveInternal(List<TimeDto> items) {
        timeMapper.deleteAllItems();
        if (items == null || items.isEmpty()) {
            return;
        }
        int order = 0;
        for (TimeDto item : items) {
            item.setOrderNo(item.getOrderNo() != null ? item.getOrderNo() : ++order);
            timeMapper.insertItem(item);
        }
    }

    @Transactional
    public void delRemove() {
        timeMapper.deleteAllItems();
    }
}

