package com.main.app.official.news.mission;

import com.main.app.official.news.mission.dto.MissionDto;
import com.main.app.official.news.mission.dto.MissionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MissionService {
    private final MissionMapper missionMapper;

    @Transactional(readOnly = true)
    public MissionDto getMission() { return missionMapper.selectMission(); }

    @Transactional
    public void createMission(MissionRequest request) throws Exception {
        if (missionMapper.insertMission(request) != 1) throw new Exception("선교지소식 등록에 실패했습니다.");
    }

    @Transactional
    public void updateMission(MissionRequest request) throws Exception {
        if (missionMapper.updateMission(request) != 1) throw new Exception("선교지소식 수정에 실패했습니다.");
    }

    @Transactional
    public void deleteMission(String id) throws Exception {
        if (missionMapper.deleteMission(id) != 1) throw new Exception("선교지소식 삭제에 실패했습니다.");
    }
}