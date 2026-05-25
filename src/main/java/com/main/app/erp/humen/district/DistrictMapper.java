package com.main.app.erp.humen.district;

import com.main.app.erp.humen.district.dto.DistrictDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DistrictMapper {

    List<DistrictDto.District> selectDistrictList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countDistrictList(@Param("keyword") String keyword);
}
