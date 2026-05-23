package com.main.app.mypage.user;

import com.main.app.mypage.user.dto.MypageUserCommentDto;
import com.main.app.mypage.user.dto.MypageUserPostDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MypageUserMapper {

    List<MypageUserPostDto> selectActivityList(@Param("userId") String userId,
                                               @Param("offset") int offset,
                                               @Param("limit") int limit);

    long countActivityList(@Param("userId") String userId);

    List<MypageUserPostDto> selectInquiryList(@Param("userId") String userId,
                                              @Param("boardTypes") List<String> boardTypes,
                                              @Param("offset") int offset,
                                              @Param("limit") int limit);

    long countInquiryList(@Param("userId") String userId,
                          @Param("boardTypes") List<String> boardTypes);

    List<MypageUserCommentDto> selectCommentList(@Param("userId") String userId,
                                                 @Param("offset") int offset,
                                                 @Param("limit") int limit);

    long countCommentList(@Param("userId") String userId);
}
