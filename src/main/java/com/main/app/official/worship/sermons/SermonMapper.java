package com.main.app.official.worship.sermons;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.main.app.official.worship.sermons.dto.SermonDto;
import com.main.app.official.worship.sermons.dto.SermonRequest;

@Mapper
public interface SermonMapper {

    List<SermonDto> selectBoardList(Map<String, Object> params);

    long countBoardList(Map<String, Object> params);

    SermonDto selectBoardDetail(Map<String, Object> params);

    void updateReadCount(Map<String, Object> params);

    void insertBoard(SermonRequest request);

    void updateBoard(SermonRequest request);

    void updateReplyOrder(Map<String, Object> params);

    void updateGroupNo(Map<String, Object> params);

    int softDeleteBoard(Long sermonId);

}
