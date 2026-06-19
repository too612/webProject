package com.main.app.official.news.youth;

import com.main.app.common.dto.CommentDto;
import com.main.app.official.news.youth.dto.YouthDto;
import com.main.app.official.news.youth.dto.YouthRequest;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface YouthMapper {
    List<YouthDto> selectBoardList(Map<String, Object> params);
    long countBoardList(Map<String, Object> params);
    YouthDto selectBoardDetail(Map<String, Object> params);
    void updateReadCount(Map<String, Object> params);
    void insertBoard(YouthRequest request);
    void updateBoard(YouthRequest request);
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