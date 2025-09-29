package com.main.app.service;

import com.main.app.model.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
}
