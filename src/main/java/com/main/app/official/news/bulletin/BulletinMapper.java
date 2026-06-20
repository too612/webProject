package com.main.app.official.news.bulletin;

import com.main.app.common.dto.CommentDto;
import com.main.app.official.news.bulletin.dto.BulletinDto;
import com.main.app.official.news.bulletin.dto.BulletinRequest;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface BulletinMapper {

    List<BulletinDto> selectBoardList(Map<String, Object> params);

    long countBoardList(Map<String, Object> params);

    BulletinDto selectBoardDetail(Map<String, Object> params);

    void updateReadCount(Map<String, Object> params);

    void insertBoard(BulletinRequest request);

    void updateBoard(BulletinRequest request);

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
