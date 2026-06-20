package com.main.app.official.about.people;

import com.main.app.official.about.people.dto.PeopleDto;
import com.main.app.official.about.people.dto.PeopleRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PeopleMapper {

    PeopleDto selectPeople();

    int insertPeople(PeopleRequest request);

    int updatePeople(@Param("id") Long id, @Param("request") PeopleRequest request);

    int deletePeople(@Param("id") Long id);
}