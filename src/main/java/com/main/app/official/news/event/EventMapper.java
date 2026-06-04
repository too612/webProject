package com.main.app.official.news.event;

import com.main.app.common.dto.CommentDto;
import com.main.app.official.news.event.dto.EventDto;
import com.main.app.official.news.event.dto.EventRequest;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface EventMapper {

    List<EventDto> selectBoardList(Map<String, Object> params);

    long countBoardList(Map<String, Object> params);

    EventDto selectBoardDetail(Map<String, Object> params);

    void updateReadCount(Map<String, Object> params);

    void insertBoard(EventRequest request);

    void updateBoard(EventRequest request);

    void updateReplyOrder(Map<String, Object> params);

    void deleteComments(String boardNo);
    void deleteBoard(String id);

    List<CommentDto> selectCommentList(String boardNo);

    void insertComment(CommentDto comment);

    CommentDto selectCommentById(int commentId);

    void increaseLike(int commentId);

    void decreaseLike(int commentId);

    void increaseDislike(int commentId);

    void decreaseDislike(int commentId);
}

