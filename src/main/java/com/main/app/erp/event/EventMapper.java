package com.main.app.erp.event;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface EventMapper {

    List<EventDto.Event> selectCalendarEvents(@Param("year") String year, @Param("month") String month);

    List<EventDto.Apply> selectApplyList(@Param("keyword") String keyword,
                                          @Param("offset") int offset,
                                          @Param("limit") int limit);
    long countApplyList(@Param("keyword") String keyword);

    List<EventDto.Apply> selectParticipantList(@Param("keyword") String keyword,
                                                @Param("offset") int offset,
                                                @Param("limit") int limit);
    long countParticipantList(@Param("keyword") String keyword);

    List<EventDto.Event> selectResultList(@Param("keyword") String keyword,
                                           @Param("offset") int offset,
                                           @Param("limit") int limit);
    long countResultList(@Param("keyword") String keyword);
}

