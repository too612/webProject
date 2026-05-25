package com.main.app.mypage.index;

import com.main.app.mypage.index.dto.MypageIndexDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MypageIndexMapper {

    long selectActivityCount(@Param("userId") String userId);

    long selectInquiryCount(@Param("userId") String userId);

    long selectNotificationCount(@Param("userId") String userId);

    List<MypageIndexDto.ActivityItem> selectRecentActivities(@Param("userId") String userId);
}
