package com.main.app.erp.sermon.write;

import com.main.app.erp.sermon.write.dto.WriteDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface WriteMapper {

    int insertWorship(@Param("req") WriteDto.WriteRequest req);
}
