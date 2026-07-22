package com.main.app.official.about.people;

import com.main.app.official.about.people.dto.PeopleDto;
import com.main.app.official.about.people.dto.PeopleMemberRowDto;
import com.main.app.official.about.people.dto.PeopleRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PeopleMapper {

    List<PeopleMemberRowDto> selectPeopleMembers();

    int insertPeople(PeopleRequest request);

    int updatePeople(@Param("id") Long id, @Param("request") PeopleRequest request);

    int deletePeople(@Param("id") Long id);
}