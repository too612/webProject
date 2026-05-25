package com.main.app.erp.event.participant;

import com.main.app.erp.event.participant.dto.ParticipantDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ParticipantMapper {

    List<ParticipantDto.Participant> selectParticipantList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countParticipantList(@Param("keyword") String keyword);
}