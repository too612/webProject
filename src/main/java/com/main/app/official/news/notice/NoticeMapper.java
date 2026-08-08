package com.main.app.official.news.notice;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NoticeMapper {

    // ============================================================
    // BOARD QUERIES
    // ============================================================

    // selectBoardList
    // countBoardList
    // selectBoardDetail
    // updateReadCount
    // insertBoard
    // updateBoard
    // updateReplyOrder
    // deleteBoard

    // ============================================================
    // COMMENT QUERIES
    // ============================================================

    // deleteComments
    // selectCommentList
    // insertComment
    // selectCommentById
    // increaseLike
    // decreaseLike
    // increaseDislike
    // decreaseDislike
}