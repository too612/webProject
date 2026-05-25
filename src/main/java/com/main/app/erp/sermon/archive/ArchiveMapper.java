package com.main.app.erp.sermon.archive;

import com.main.app.erp.sermon.archive.dto.ArchiveDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ArchiveMapper {

    List<ArchiveDto.Archive> selectArchiveList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countArchiveList(@Param("keyword") String keyword);
}
