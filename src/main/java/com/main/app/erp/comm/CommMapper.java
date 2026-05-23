package com.main.app.erp.comm;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface CommMapper {

    List<CommDto.Notice> selectNoticeList(@Param("keyword") String keyword,
                                           @Param("offset") int offset,
                                           @Param("limit") int limit);
    long countNoticeList(@Param("keyword") String keyword);

    List<CommDto.Message> selectMessageList(@Param("keyword") String keyword,
                                             @Param("offset") int offset,
                                             @Param("limit") int limit);
    long countMessageList(@Param("keyword") String keyword);

    List<CommDto.Prayer> selectPrayerList(@Param("keyword") String keyword,
                                           @Param("offset") int offset,
                                           @Param("limit") int limit);
    long countPrayerList(@Param("keyword") String keyword);

    List<CommDto.Newsletter> selectNewsletterList(@Param("keyword") String keyword,
                                                   @Param("offset") int offset,
                                                   @Param("limit") int limit);
    long countNewsletterList(@Param("keyword") String keyword);
}

