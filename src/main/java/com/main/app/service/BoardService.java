package com.main.app.service;

import com.main.app.model.Board;
import java.util.List;

public interface BoardService {
    List<Board> getAllBoards();
    List<Board> getLatestBoards();
    Board getBoard(Long id);
    Board saveBoard(Board board);
    void deleteBoard(Long id);
}
