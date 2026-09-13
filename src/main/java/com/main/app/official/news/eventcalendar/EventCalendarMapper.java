package com.main.app.official.news.eventcalendar;

import com.main.app.official.news.eventcalendar.dto.EventCalendarDto;
import com.main.app.official.news.eventcalendar.dto.EventCalendarRequest;
import com.main.app.official.news.eventcalendar.dto.EventCategoryDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EventCalendarMapper {

    /**
     * 행사 일정 목록 조회 (구분값명 포함)
     */
    List<EventCalendarDto> selectEventList();

    /**
     * 행사 구분값(com_code) 목록 조회
     */
    List<EventCategoryDto> selectCategoryList();

    /**
     * 행사 일정 등록
     */
    int insertEvent(EventCalendarRequest request);

    /**
     * 행사 일정 수정
     */
    int updateEvent(EventCalendarRequest request);

    /**
     * 행사 일정 소프트 삭제
     */
    int softDeleteEvent(@Param("eventKey") String eventKey);
}
