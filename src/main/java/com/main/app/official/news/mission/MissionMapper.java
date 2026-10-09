package com.main.app.official.news.mission;

import com.main.app.official.news.mission.dto.MissionDto;
import com.main.app.official.news.mission.dto.MissionRequest;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MissionMapper {
    List<MissionDto> getInfo();
    int insertMission(MissionRequest request);
    int updateMission(MissionRequest request);
    int deleteMission(String id);
}