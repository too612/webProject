package com.main.app.official.worship.sermons;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.main.app.common.dto.CommentDto;
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

    int softDeleteComments(Long sermonId);

    int softDeleteFiles(Long sermonId);

    int softDeleteBoard(Long sermonId);

    void insertFile(com.main.app.common.file.dto.FileDto fileDto);

    com.main.app.common.file.dto.FileDto selectFile(Long fileId);

    List<com.main.app.common.file.dto.FileDto> selectFileList(Long sermonId);

    int softDeleteFileById(Long fileId);

    List<CommentDto> selectCommentList(String boardNo);

    void insertComment(CommentDto comment);

    CommentDto selectCommentById(int commentId);

    void increaseLike(int commentId);

    void decreaseLike(int commentId);

    void increaseDislike(int commentId);

    void decreaseDislike(int commentId);
}
