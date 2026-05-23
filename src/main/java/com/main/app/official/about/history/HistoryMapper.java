package com.main.app.official.about.history;

import com.main.app.official.about.history.dto.HistoryDto;
import com.main.app.official.about.history.dto.HistoryRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface HistoryMapper {

    HistoryDto selectHistory();

    int insertHistory(HistoryRequest request);

    int updateHistory(@Param("id") Long id, @Param("request") HistoryRequest request);

    int deleteHistory(@Param("id") Long id);
}
