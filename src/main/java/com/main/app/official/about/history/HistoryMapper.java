package com.main.app.official.about.history;

import com.main.app.official.about.history.dto.HistoryEventDto;
import com.main.app.official.about.history.dto.HistoryRequest;
import com.main.app.official.about.history.dto.HistoryYearDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface HistoryMapper {

    List<HistoryYearDto> selectHistoryYears();

    List<HistoryEventDto> selectHistoryEvents();

    int deleteAllYears();

    int insertYear(HistoryYearDto year);

    int insertEvent(@Param("historyId") Long historyId,
                    @Param("eventDate") String eventDate,
                    @Param("description") String description,
                    @Param("imagesJson") String imagesJson,
                    @Param("sortOrder") int sortOrder);
}
