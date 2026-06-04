package com.main.app.official.support.qna;

import com.main.app.common.dto.CommentDto;
import com.main.app.official.support.qna.dto.QnaDto;
import com.main.app.official.support.qna.dto.QnaRequest;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface QnaMapper {

    List<QnaDto> selectBoardList(Map<String, Object> params);

    long countBoardList(Map<String, Object> params);

    QnaDto selectBoardDetail(Map<String, Object> params);

    void updateReadCount(Map<String, Object> params);

    void insertBoard(QnaRequest request);

    void updateBoard(QnaRequest request);

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

