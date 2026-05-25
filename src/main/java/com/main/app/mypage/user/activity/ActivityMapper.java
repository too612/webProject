package com.main.app.mypage.user.activity;

import com.main.app.mypage.user.activity.dto.ActivityPostDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ActivityMapper {

    List<ActivityPostDto> selectActivityList(@Param("userId") String userId,
                                             @Param("offset") int offset,
                                             @Param("limit") int limit);

    long countActivityList(@Param("userId") String userId);
}
