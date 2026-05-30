package com.main.app.common.corp;

import com.main.app.common.corp.dto.CorpDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CorpMapper {

    CorpDto selectCorpInfo(@Param("sessIp") String sessIp);
}