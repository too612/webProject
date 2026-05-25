package com.main.app.official.worship.live;

import com.main.app.official.worship.live.dto.LiveDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LiveService {

    private final LiveMapper liveMapper;

    public LiveService(LiveMapper liveMapper) {
        this.liveMapper = liveMapper;
    }

    @Transactional(readOnly = true)
    public List<LiveDto> getLiveItems() {
        return liveMapper.selectLiveItems();
    }
}
