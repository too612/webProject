package com.main.app.official.worship.time;

import com.main.app.official.worship.time.dto.TimeDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TimeMapper {

    List<TimeDto> selectTimeItems();
}
