package com.main.app.service;

import com.main.app.model.Board;
import com.main.app.model.BoardDto;
import com.main.app.model.CommentDto;
import com.main.app.model.FileDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface BoardService {
    Page<Board> getBoards(Pageable pageable);
    List<Board> getBoardInfo(Map<String, Object> params);
    Page<Board> searchBoards(String searchType, String keyword, Pageable pageable);
    List<Board> getLatestBoards();
    Board getBoard(String id);
    Board saveBoard(Board board);
    void deleteBoard(String id);

    // QnA 게시판용 메서드 추가
    Page<BoardDto> getBoardList(Pageable pageable, String searchType, String keyword);
    BoardDto getBoardDetail(String rqstNo);
    void saveBoard(BoardDto board, List<MultipartFile> files);
    void updateBoard(BoardDto board, List<MultipartFile> files);
    FileDto getFile(Long fileId);
    List<CommentDto> getCommentList(String boardNo);
    void saveComment(CommentDto comment);
    CommentDto getComment(Long commentId);
    void handleVote(Long commentId, String action, String previousVote);
}
