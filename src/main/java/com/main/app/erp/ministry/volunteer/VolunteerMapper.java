package com.main.app.erp.ministry.volunteer;

import com.main.app.erp.ministry.volunteer.dto.VolunteerDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface VolunteerMapper {

    List<VolunteerDto.Volunteer> selectVolunteerList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countVolunteerList(@Param("keyword") String keyword);
}
