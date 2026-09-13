package com.main.app.official.missionary;

import com.main.app.official.missionary.dto.MissionaryDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MissionaryService {

    private final MissionaryMapper missionaryMapper;

    public MissionaryService(MissionaryMapper missionaryMapper) {
        this.missionaryMapper = missionaryMapper;
    }

    public List<MissionaryDto> getMissionaries() {
        return missionaryMapper.selectMissionaries();
    }
}
