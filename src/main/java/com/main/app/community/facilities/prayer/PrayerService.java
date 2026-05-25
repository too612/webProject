package com.main.app.community.facilities.prayer;

import com.main.app.community.facilities.prayer.dto.PrayerDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrayerService {

    private final PrayerMapper prayerMapper;

    public PrayerService(PrayerMapper prayerMapper) {
        this.prayerMapper = prayerMapper;
    }

    public List<PrayerDto> getPrayerRooms() {
        return prayerMapper.selectBoards(0, 50);
    }
}