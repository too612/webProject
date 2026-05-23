package com.main.app.official.about.pastor;

import com.main.app.official.about.pastor.dto.PastorDto;
import com.main.app.official.about.pastor.dto.PastorRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PastorMapper {

    PastorDto selectPastorProfile();

    int insertPastorProfile(PastorRequest request);

    int updatePastorProfile(@Param("corpId") Long corpId, @Param("request") PastorRequest request);

    int softDeletePastorProfile(@Param("corpId") Long corpId, @Param("updatedBy") String updatedBy,
            @Param("updatedIp") String updatedIp);
}
