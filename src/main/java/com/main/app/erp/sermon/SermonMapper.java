package com.main.app.erp.sermon;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface SermonMapper {

    List<SermonErpDto.Worship> selectWorshipList(@Param("keyword") String keyword,
                                                  @Param("offset") int offset,
                                                  @Param("limit") int limit);
    long countWorshipList(@Param("keyword") String keyword);

    List<SermonErpDto.Worship> selectArchiveList(@Param("keyword") String keyword,
                                                  @Param("offset") int offset,
                                                  @Param("limit") int limit);
    long countArchiveList(@Param("keyword") String keyword);

    List<SermonErpDto.Attendance> selectAttendanceList(@Param("keyword") String keyword,
                                                        @Param("offset") int offset,
                                                        @Param("limit") int limit);
    long countAttendanceList(@Param("keyword") String keyword);

    List<SermonErpDto.Order> selectOrderList(@Param("worshipId") String worshipId,
                                             @Param("offset") int offset,
                                             @Param("limit") int limit);
    long countOrderList(@Param("worshipId") String worshipId);
}

