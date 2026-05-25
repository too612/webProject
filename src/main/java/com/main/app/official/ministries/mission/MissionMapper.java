package com.main.app.official.ministries.mission;

import com.main.app.common.dto.CommentDto;
import com.main.app.common.dto.FileDto;
import com.main.app.official.ministries.mission.dto.MissionDto;
import com.main.app.official.ministries.mission.dto.MissionRequest;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface MissionMapper {

    List<MissionDto> selectBoardList(Map<String, Object> params);

    long countBoardList(Map<String, Object> params);

    MissionDto selectBoardDetail(Map<String, Object> params);

    void updateReadCount(Map<String, Object> params);

    void insertBoard(MissionRequest request);

    void updateBoard(MissionRequest request);

    void updateReplyOrder(Map<String, Object> params);

    void deleteComments(String boardNo);

    void deleteFiles(String boardNo);

    void deleteBoard(String id);

    void insertFile(FileDto fileDto);

    FileDto selectFile(Long fileId);

    List<FileDto> selectFileList(String boardNo);

    List<CommentDto> selectCommentList(String boardNo);

    void insertComment(CommentDto comment);

    CommentDto selectCommentById(int commentId);

    void increaseLike(int commentId);

    void decreaseLike(int commentId);

    void increaseDislike(int commentId);

    void decreaseDislike(int commentId);
}
