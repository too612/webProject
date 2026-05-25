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
}
