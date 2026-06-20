package com.main.app.official.news.mission;

import com.main.app.official.news.mission.dto.MissionDto;
import com.main.app.official.news.mission.dto.MissionRequest;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MissionMapper {
    MissionDto selectMission();
    int insertMission(MissionRequest request);
    int updateMission(MissionRequest request);
    int deleteMission(String id);
}