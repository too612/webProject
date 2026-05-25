package com.main.app.community.facilities.prayer;

import com.main.app.community.facilities.prayer.dto.PrayerDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PrayerMapper {

    List<PrayerDto> selectBoards(@Param("offset") int offset,
            @Param("limit") int limit);
}