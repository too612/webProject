package com.main.app.erp.humen;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface HumenMapper {

    List<HumenDto.Member> selectMemberList(@Param("keyword") String keyword,
                                           @Param("offset") int offset,
                                           @Param("limit") int limit);
    long countMemberList(@Param("keyword") String keyword);

    List<HumenDto.Member> selectNewcomerList(@Param("keyword") String keyword,
                                             @Param("offset") int offset,
                                             @Param("limit") int limit);
    long countNewcomerList(@Param("keyword") String keyword);

    List<HumenDto.District> selectDistrictList(@Param("keyword") String keyword,
                                               @Param("offset") int offset,
                                               @Param("limit") int limit);
    long countDistrictList(@Param("keyword") String keyword);

    List<HumenDto.Change> selectChangeList(@Param("keyword") String keyword,
                                           @Param("offset") int offset,
                                           @Param("limit") int limit);
    long countChangeList(@Param("keyword") String keyword);
}

