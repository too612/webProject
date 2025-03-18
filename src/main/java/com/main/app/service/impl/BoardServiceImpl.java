package com.main.app.service.impl;

import com.main.app.mapper.BoardMapper;
import com.main.app.model.Board;
import com.main.app.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BoardServiceImpl implements BoardService {

    @Autowired
    private BoardMapper boardMapper;

    @Override
    public List<Board> getAllBoards() {
        return boardMapper.selectAllBoards();
    }

    @Override
    public List<Board> getLatestBoards() {
        return boardMapper.selectLatestBoards();
    }

    @Override
    public Board getBoard(Long id) {
        return boardMapper.selectBoardById(id);
    }

    @Override
    public Board saveBoard(Board board) {
        if (board.getId() == null) {
            boardMapper.insertBoard(board);
        } else {
            boardMapper.updateBoard(board);
        }
        return board;
    }

    @Override
    public void deleteBoard(Long id) {
        boardMapper.deleteBoard(id);
    }
}
