package com.main.app.mapper;

import com.main.app.model.Board;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface BoardMapper {
    List<Board> selectAllBoards();
    List<Board> selectLatestBoards();
    Board selectBoardById(Long id);
    void insertBoard(Board board);
    void updateBoard(Board board);
    void deleteBoard(Long id);
}
