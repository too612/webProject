package com.main.app.common.mapper;

import com.main.app.common.dto.Board;
import com.main.app.common.dto.BoardDto;
import com.main.app.common.dto.CommentDto;
import com.main.app.common.dto.FileDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface BoardMapper {
    // 기존 게시판 메서드
    List<Board> selectAllBoards(Map<String, Object> params);

    long countAllBoards(Map<String, Object> params);

    List<Board> getBoardInfo(Map<String, Object> params);

    List<Board> searchBoards(Map<String, Object> params);

    long countSearchedBoards(Map<String, Object> params);

    List<Board> selectLatestBoards(Map<String, Object> params);

    Board selectBoardById(Map<String, Object> params);

    void insertBoard(Board board);

    void updateBoard(Board board);

    void deleteBoard(String id);

    // QnA 게시판 및 파일/댓글용 메서드 추가
    List<BoardDto> selectBoardList(Map<String, Object> params);

    long countBoardList(Map<String, Object> params);

    BoardDto selectBoardDetail(Map<String, Object> params);

    void updateReadCount(Map<String, Object> params);

    void insertFile(FileDto fileDto);

    List<FileDto> selectFileList(String boardNo);

    void deleteFiles(String boardNo);

    void deleteComments(String boardNo);

    FileDto selectFile(Long fileId);

    List<CommentDto> selectCommentList(String boardNo);

    void insertComment(CommentDto comment);

    void updateReplyOrder(Map<String, Object> params);

    void increaseLike(int commentId);

    void decreaseLike(int commentId);

    void increaseDislike(int commentId);

    void decreaseDislike(int commentId);

    CommentDto selectCommentById(int commentId);

}
