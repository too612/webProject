package com.main.app.official.news.nextsteps;

import com.main.app.official.news.nextsteps.dto.NextstepsDto;
import com.main.app.official.news.nextsteps.dto.NextstepsRequest;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NextstepsMapper {
    NextstepsDto selectNextsteps();
    int insertNextsteps(NextstepsRequest request);
    int updateNextsteps(NextstepsRequest request);
    int deleteNextsteps(String id);
}