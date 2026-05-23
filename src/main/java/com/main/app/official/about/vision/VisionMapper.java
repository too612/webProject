package com.main.app.official.about.vision;

import com.main.app.official.about.vision.dto.VisionDto;
import com.main.app.official.about.vision.dto.VisionRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface VisionMapper {

    VisionDto selectVision();

    int insertVision(VisionRequest request);

    int updateVision(@Param("id") Long id, @Param("request") VisionRequest request);

    int deleteVision(@Param("id") Long id);
}
