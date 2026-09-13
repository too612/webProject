package com.main.app.official.about.people;

import com.main.app.official.about.people.dto.PeopleMemberRowDto;
import com.main.app.official.about.people.dto.PeopleCareerRowDto;
import com.main.app.official.about.people.dto.PeopleEducationRowDto;
import com.main.app.official.about.people.dto.PeopleRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PeopleMapper {

    List<PeopleMemberRowDto> selectPeopleMembers();

    List<PeopleEducationRowDto> selectPeopleEducations(@Param("employeeNo") String employeeNo);

    List<PeopleCareerRowDto> selectPeopleCareers(@Param("employeeNo") String employeeNo);

    int insertPeople(PeopleRequest request);

    int updatePeople(@Param("id") Long id, @Param("request") PeopleRequest request);

    int deletePeople(@Param("id") Long id);
}