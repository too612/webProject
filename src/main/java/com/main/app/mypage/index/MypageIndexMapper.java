package com.main.app.mypage.index;

import com.main.app.mypage.index.dto.MypageIndexDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MypageIndexMapper {

    MypageIndexDto selectMetadata(@Param("source") MypageIndexDto.Source source);

    MypageIndexDto.Stats selectStats(@Param("userId") String userId);

    List<MypageIndexDto.MonthlyActivity> selectMonthlyActivities(@Param("userId") String userId);

    List<MypageIndexDto.Category> selectCategories(@Param("userId") String userId);

    List<MypageIndexDto.ActivityItem> selectRecentActivities(@Param("userId") String userId);

    MypageIndexDto.Stats selectDemoStats();

    List<MypageIndexDto.MonthlyActivity> selectDemoMonthlyActivities();

    List<MypageIndexDto.Category> selectDemoCategories();

    List<MypageIndexDto.ActivityItem> selectDemoRecentActivities();
}
