package com.main.app.erp.comm.prayer;

import com.main.app.erp.comm.prayer.dto.PrayerDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PrayerMapper {

    List<PrayerDto.Prayer> selectPrayerList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countPrayerList(@Param("keyword") String keyword);
}

