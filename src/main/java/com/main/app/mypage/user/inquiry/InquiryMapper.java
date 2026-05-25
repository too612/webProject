package com.main.app.mypage.user.inquiry;

import com.main.app.mypage.user.inquiry.dto.InquiryPostDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface InquiryMapper {

    List<InquiryPostDto> selectInquiryList(@Param("userId") String userId,
                                           @Param("boardTypes") List<String> boardTypes,
                                           @Param("offset") int offset,
                                           @Param("limit") int limit);

    long countInquiryList(@Param("userId") String userId,
                          @Param("boardTypes") List<String> boardTypes);
}
