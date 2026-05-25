package com.main.app.erp.comm.notice;

import com.main.app.erp.comm.notice.dto.NoticeDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface NoticeMapper {

    List<NoticeDto.Notice> selectNoticeList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countNoticeList(@Param("keyword") String keyword);
}

