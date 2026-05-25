package com.main.app.community.saint.job;

import com.main.app.community.saint.job.dto.JobDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface JobMapper {

    List<JobDto> selectBoards(@Param("keyword") String keyword,
                              @Param("offset") int offset,
                              @Param("limit") int limit);

    long countBoards(@Param("keyword") String keyword);
}