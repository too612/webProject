package com.main.app.erp.comm.message;

import com.main.app.erp.comm.message.dto.MessageDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MessageMapper {

    List<MessageDto.Message> selectMessageList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countMessageList(@Param("keyword") String keyword);
}

