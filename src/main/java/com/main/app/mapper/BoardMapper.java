package com.main.app.mapper;

import com.main.app.model.Board;
import com.main.app.model.BoardDto;
import com.main.app.model.CommentDto;
import com.main.app.model.FileDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface BoardMapper {
    // 기존 게시판 메서드
    List<Board> selectAllBoards(Map<String, Object> params);
    long countAllBoards();
    List<Board> getBoardInfo(Map<String, Object> params);
    List<Board> searchBoards(Map<String, Object> params);
    long countSearchedBoards(Map<String, Object> params);
    List<Board> selectLatestBoards();
    Board selectBoardById(String rqstNo);
    void insertBoard(Board board);
    void updateBoard(Board board);
    void deleteBoard(String id);

    // QnA 게시판 및 파일/댓글용 메서드 추가
    List<BoardDto> selectBoardList(Map<String, Object> params);
    BoardDto selectBoardDetail(String rqstNo);
    void updateReadCount(String rqstNo);
    
    void insertFile(FileDto fileDto);
    List<FileDto> selectFileList(String boardNo);
    void deleteFiles(String boardNo);
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
