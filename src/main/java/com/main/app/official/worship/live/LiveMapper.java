package com.main.app.official.worship.live;

import com.main.app.official.worship.live.dto.LiveDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface LiveMapper {

    List<LiveDto> selectLiveItems();
}
