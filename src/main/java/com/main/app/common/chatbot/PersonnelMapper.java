package com.main.app.common.chatbot;

import com.main.app.common.chatbot.dto.PersonnelCountDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PersonnelMapper {

    List<PersonnelCountDto> selectRoleCounts();
}
