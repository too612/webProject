package com.main.app.mapper;

import com.main.app.model.Board;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Map;

@Mapper
public interface BoardMapper {
    List<Board> selectAllBoards(Map<String, Object> params);
    long countAllBoards();
    List<Board> getBoardInfo (Map<String, Object> params);
    List<Board> searchBoards(Map<String, Object> params);
    long countSearchedBoards(Map<String, Object> params);
    List<Board> selectLatestBoards();
    Board selectBoardById(String id);
    void insertBoard(Board board);
    void updateBoard(Board board);
    void deleteBoard(String id);
}
