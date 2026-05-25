package com.main.app.community.index;

import com.main.app.community.index.dto.CommunityIndexDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommunityIndexMapper {

    List<CommunityIndexDto.PostItem> selectRecentPosts();

    List<CommunityIndexDto.NoticeItem> selectNotices();

    List<CommunityIndexDto.ActivityItem> selectActivities();

    long selectTotalMembers();

    long selectTotalPosts();
}
