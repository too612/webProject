package com.main.app.official.news.bulletin.mapper;

import com.main.app.common.dto.CommentDto;
import com.main.app.common.dto.FileDto;
import com.main.app.official.news.bulletin.dto.BulletinDto;
import com.main.app.official.news.bulletin.dto.BulletinRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class BulletinMapper {

    private static final String BOARD_TYPE = "BULLETIN";

    private final BulletinBoardMapper boardMapper;

    public BulletinMapper(BulletinBoardMapper boardMapper) {
        this.boardMapper = boardMapper;
    }

    public List<BulletinDto> selectBoardList(Pageable pageable, String searchType, String keyword) {
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

    public BulletinDto selectBoardDetail(String rqstNo, boolean increaseViewCount) {
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

    public void insertBoard(BulletinRequest request) {
        boardMapper.insertBoard(request);
    }

    public void updateBoard(BulletinRequest request) {
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
