package com.main.app.service.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.main.app.mapper.BoardMapper;
import com.main.app.model.Board;
import com.main.app.service.AutoNoService;
import com.main.app.service.BoardService;

@Service
public class BoardServiceImpl implements BoardService {

    @Autowired
    private BoardMapper boardMapper;

    
    @Autowired
    private AutoNoService autoNoService;

    @Override
    public Page<Board> getBoards(Pageable pageable) {
        Map<String, Object> params = new HashMap<>();
        params.put("offset", pageable.getOffset());
        params.put("limit", pageable.getPageSize());
        List<Board> boards = boardMapper.selectAllBoards(params);
        long total = boardMapper.countAllBoards();
        return new PageImpl<>(boards, pageable, total);
    }

    @Override
    public List<Board> getBoardInfo(Map<String, Object> params) {
        return boardMapper.getBoardInfo(params);
    }
    
    @Override
    public Page<Board> searchBoards(String searchType, String keyword, Pageable pageable) {
        HashMap<String, Object> params = new HashMap<>();
        params.put("searchType", searchType);
        params.put("keyword", keyword);
        params.put("offset", pageable.getOffset());
        params.put("limit", pageable.getPageSize());
        List<Board> boards = boardMapper.searchBoards(params);
        long total = boardMapper.countSearchedBoards(params);
        return new PageImpl<>(boards, pageable, total);
    }

    @Override
    public List<Board> getLatestBoards() {
        return boardMapper.selectLatestBoards();
    }

    @Override
    public Board getBoard(String id) {
        return boardMapper.selectBoardById(id);
    }

    @Override
    public Board saveBoard(Board board) {
        if (board.getRqstNo() == null || board.getRqstNo().isEmpty()) {
            LocalDate today = LocalDate.now();
            String todayString = today.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            Map <String, Object> map = new HashMap<>();
            map.put("pre_fix", "QNA");
            map.put("REG_DT", todayString);

            String getKey = autoNoService.getKey(map);
            System.out.println("getKey====>: " + getKey);
            board.setRqstNo(getKey);
            boardMapper.insertBoard(board);
        } else {
            boardMapper.updateBoard(board);
        }
        return board;
    }

    @Override
    public void deleteBoard(String id) {
        boardMapper.deleteBoard(id);
    }
}
