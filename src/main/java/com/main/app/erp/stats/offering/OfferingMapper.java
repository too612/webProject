package com.main.app.erp.stats.offering;

import com.main.app.erp.stats.offering.dto.OfferingDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OfferingMapper {

    List<OfferingDto.OfferingStat> selectOfferingStats(@Param("year") String year,
            @Param("month") String month);
}
