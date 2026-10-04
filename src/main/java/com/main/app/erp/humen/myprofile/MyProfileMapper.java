package com.main.app.erp.humen.myprofile;

import com.main.app.erp.humen.myprofile.dto.MyProfileDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MyProfileMapper {

    MyProfileDto.Profile selectProfileByUserId(@Param("userId") String userId);

    String selectPersonKeyByUserId(@Param("userId") String userId);

    List<MyProfileDto.Assignment> selectAssignments(@Param("personKey") String personKey);

    List<MyProfileDto.Career> selectCareers(@Param("personKey") String personKey);

    List<MyProfileDto.Education> selectEducations(@Param("personKey") String personKey);

    int updateOwnContactInfo(@Param("userId") String userId,
            @Param("contact") MyProfileDto.ContactUpdate contact);
}
