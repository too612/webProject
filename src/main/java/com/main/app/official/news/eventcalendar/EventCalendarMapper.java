package com.main.app.official.news.eventcalendar;

import com.main.app.official.news.eventcalendar.dto.EventCalendarDto;
import com.main.app.official.news.eventcalendar.dto.EventCalendarRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface EventCalendarMapper {

    /**
     * 행사달력 단건 조회 (활성 상태 1건)
     */
    EventCalendarDto selectInfo();

    /**
     * 행사달력 등록
     *
     * @return 생성된 eventCalendarId (useGeneratedKeys)
     */
    int insertInfo(EventCalendarRequest request);

    /**
     * 행사달력 수정
     */
    int updateInfo(EventCalendarRequest request);

    /**
     * 행사달력 소프트 삭제
     */
    int softDeleteInfo(@Param("eventCalendarId") Long eventCalendarId);
}
