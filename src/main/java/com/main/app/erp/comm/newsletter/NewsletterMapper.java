package com.main.app.erp.comm.newsletter;

import com.main.app.erp.comm.newsletter.dto.NewsletterDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface NewsletterMapper {

    List<NewsletterDto.Newsletter> selectNewsletterList(@Param("keyword") String keyword,
                                                        @Param("offset") int offset,
                                                        @Param("limit") int limit);

    long countNewsletterList(@Param("keyword") String keyword);
}
