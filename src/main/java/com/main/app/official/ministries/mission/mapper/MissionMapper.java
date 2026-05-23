package com.main.app.official.ministries.mission.mapper;

import com.main.app.common.dto.CommentDto;
import com.main.app.common.dto.FileDto;
import com.main.app.official.ministries.mission.dto.MissionDto;
import com.main.app.official.ministries.mission.dto.MissionRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class MissionMapper {

    private static final String BOARD_TYPE = "MISSION";

    private final MissionBoardMapper boardMapper;

    public MissionMapper(MissionBoardMapper boardMapper) {
        this.boardMapper = boardMapper;
    }

    public List<MissionDto> selectBoardList(Pageable pageable, String searchType, String keyword) {
        Map<String, Object> params = new HashMap<>();
        params.put("searchType", searchType);
        params.put("keyword", keyword);
        params.put("size", pageable.getPageSize());
        params.put("offset", pageable.getOffset());
        params.put("boardType", BOARD_TYPE);
        return boardMapper.selectBoardList(params);
    }

    public long countBoardList(String searchType, String keyword) {
        Map<String, Object> params = new HashMap<>();
        params.put("searchType", searchType);
        params.put("keyword", keyword);
        params.put("boardType", BOARD_TYPE);
        return boardMapper.countBoardList(params);
    }

    public MissionDto selectBoardDetail(String rqstNo, boolean increaseViewCount) {
        Map<String, Object> params = new HashMap<>();
        params.put("rqstNo", rqstNo);
        params.put("boardType", BOARD_TYPE);

        if (increaseViewCount) {
            boardMapper.updateReadCount(params);
        }
        return boardMapper.selectBoardDetail(params);
    }

    public List<FileDto> selectFileList(String boardNo) {
        return boardMapper.selectFileList(boardNo);
    }

    public void insertBoard(MissionRequest request) {
        boardMapper.insertBoard(request);
    }

    public void updateBoard(MissionRequest request) {
        boardMapper.updateBoard(request);
    }

    public void updateReplyOrder(String groupNo, Integer orderNo) {
        Map<String, Object> params = new HashMap<>();
        params.put("groupNo", groupNo);
        params.put("orderNo", orderNo);
        boardMapper.updateReplyOrder(params);
    }

    public void deleteComments(String rqstNo) {
        boardMapper.deleteComments(rqstNo);
    }

    public void deleteFiles(String rqstNo) {
        boardMapper.deleteFiles(rqstNo);
    }

    public void deleteBoard(String rqstNo) {
        boardMapper.deleteBoard(rqstNo);
    }

    public void insertFile(FileDto fileDto) {
        boardMapper.insertFile(fileDto);
    }

    public FileDto selectFile(Long fileId) {
        return boardMapper.selectFile(fileId);
    }

    public List<CommentDto> selectCommentList(String boardNo) {
        return boardMapper.selectCommentList(boardNo);
    }

    public void insertComment(CommentDto commentDto) {
        boardMapper.insertComment(commentDto);
    }

    public CommentDto selectCommentById(int commentId) {
        return boardMapper.selectCommentById(commentId);
    }

    public void increaseLike(int commentId) {
        boardMapper.increaseLike(commentId);
    }

    public void decreaseLike(int commentId) {
        boardMapper.decreaseLike(commentId);
    }

    public void increaseDislike(int commentId) {
        boardMapper.increaseDislike(commentId);
    }

    public void decreaseDislike(int commentId) {
        boardMapper.decreaseDislike(commentId);
    }
}