package com.main.app.common.service.impl;

import java.io.File;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.main.app.common.mapper.BoardMapper;
import com.main.app.common.dto.Board;
import com.main.app.common.dto.BoardDto;
import com.main.app.common.dto.CommentDto;
import com.main.app.common.dto.FileDto;
import com.main.app.common.service.BoardService;

@Service
public class BoardServiceImpl implements BoardService {

    @Autowired
    private BoardMapper boardMapper;

    @Value("${spring.servlet.multipart.location:c:/upload/}")
    private String uploadPath;

    @Override
    public Page<Board> getBoards(Pageable pageable) {
        Map<String, Object> params = new HashMap<>();
        params.put("limit", pageable.getPageSize());
        params.put("offset", pageable.getOffset());
        List<Board> boards = boardMapper.selectAllBoards(params);
        if (boards == null) {
            boards = Collections.emptyList();
        }
        return new PageImpl<>(boards, pageable, boardMapper.countAllBoards(params));
    }

    @Override
    public List<Board> getBoardInfo(Map<String, Object> params) {
        return boardMapper.getBoardInfo(params);
    }

    @Override
    public Page<Board> searchBoards(String searchType, String keyword, Pageable pageable) {
        Map<String, Object> params = new HashMap<>();
        params.put("searchType", searchType);
        params.put("keyword", keyword);
        params.put("limit", pageable.getPageSize());
        params.put("offset", pageable.getOffset());
        List<Board> boards = boardMapper.searchBoards(params);
        if (boards == null) {
            boards = Collections.emptyList();
        }
        return new PageImpl<>(boards, pageable, boardMapper.countSearchedBoards(params));
    }

    @Override
    public List<Board> getLatestBoards() {
        return boardMapper.selectLatestBoards(new HashMap<>());
    }

    @Override
    public Board getBoard(String id) {
        Map<String, Object> params = new HashMap<>();
        params.put("rqstNo", id);
        return boardMapper.selectBoardById(params);
    }

    @Override
    public Board saveBoard(Board board) {
        if (board.getRqstNo() == null || board.getRqstNo().isEmpty()) {
            board.setRqstNo(UUID.randomUUID().toString());
            boardMapper.insertBoard(board);
        } else {
            boardMapper.updateBoard(board);
        }
        return board;
    }

    @Override
    @Transactional
    public void deleteBoard(String id) {
        boardMapper.deleteComments(id);
        boardMapper.deleteFiles(id);
        boardMapper.deleteBoard(id);
    }

    // --- QnA 게시판 구현 ---

    @Override
    public Page<BoardDto> getBoardList(Pageable pageable, String searchType, String keyword, String boardType) {
        Map<String, Object> params = new HashMap<>();
        params.put("searchType", searchType);
        params.put("keyword", keyword);
        params.put("size", pageable.getPageSize());
        params.put("offset", pageable.getOffset());
        params.put("boardType", boardType);

        List<BoardDto> list = boardMapper.selectBoardList(params);
        if (list == null) {
            list = Collections.emptyList();
        }
        long total = boardMapper.countBoardList(params);

        return new PageImpl<>(list, pageable, total);
    }

    @Override
    public BoardDto getBoardDetail(String rqstNo, String boardType) {
        Map<String, Object> params = new HashMap<>();
        params.put("rqstNo", rqstNo);
        params.put("boardType", boardType);

        boardMapper.updateReadCount(params);
        BoardDto board = boardMapper.selectBoardDetail(params);
        if (board != null) {
            board.setFileList(boardMapper.selectFileList(rqstNo));
        }
        return board;
    }

    @Override
    @Transactional
    public void saveBoard(BoardDto boardDto, List<MultipartFile> files) {
        Board board = convertToBoard(boardDto);

        if (board.getRqstNo() == null || board.getRqstNo().isEmpty()) {
            board.setRqstNo(UUID.randomUUID().toString());

            // 답글 처리 로직
            if (board.getParentNo() != null && !board.getParentNo().isEmpty()) {
                Map<String, Object> parentParams = new HashMap<>();
                parentParams.put("rqstNo", board.getParentNo());
                parentParams.put("boardType", board.getBoardType());
                BoardDto parent = boardMapper.selectBoardDetail(parentParams);
                if (parent != null) {
                    board.setGroupNo(parent.getGroupNo());
                    board.setDepth(parent.getDepth() + 1);

                    // 순서 조정 (들어갈 자리 만들기)
                    Map<String, Object> params = new HashMap<>();
                    params.put("groupNo", parent.getGroupNo());
                    params.put("orderNo", parent.getOrderNo());
                    boardMapper.updateReplyOrder(params);

                    board.setOrderNo(parent.getOrderNo() + 1);
                }
            } else {
                board.setGroupNo(board.getRqstNo());
                board.setDepth(0);
                board.setOrderNo(0);
            }
            boardMapper.insertBoard(board);
        } else {
            boardMapper.updateBoard(board);
        }
        processFiles(board.getRqstNo(), files);
    }

    @Override
    @Transactional
    public void updateBoard(BoardDto boardDto, List<MultipartFile> files) {
        Board board = convertToBoard(boardDto);
        boardMapper.updateBoard(board);
        processFiles(board.getRqstNo(), files);
    }

    private void processFiles(String boardNo, List<MultipartFile> files) {
        if (files != null && !files.isEmpty()) {
            for (MultipartFile mf : files) {
                if (mf.isEmpty())
                    continue;
                try {
                    String orgName = mf.getOriginalFilename();
                    String storedName = UUID.randomUUID().toString() + "_" + orgName;
                    File dest = new File(uploadPath + storedName);
                    if (!dest.getParentFile().exists())
                        dest.getParentFile().mkdirs();
                    mf.transferTo(dest);

                    FileDto fileDto = new FileDto();
                    fileDto.setBoardNo(boardNo);
                    fileDto.setOrgFileNm(orgName);
                    fileDto.setStoredFileNm(storedName);
                    fileDto.setFileSize(mf.getSize());
                    fileDto.setFilePath(dest.getAbsolutePath());
                    boardMapper.insertFile(fileDto);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    @Override
    public FileDto getFile(Long fileId) {
        return boardMapper.selectFile(fileId);
    }

    @Override
    public List<CommentDto> getCommentList(String boardNo) {
        return boardMapper.selectCommentList(boardNo);
    }

    @Override
    public void saveComment(CommentDto comment) {
        boardMapper.insertComment(comment);
    }

    @Override
    public CommentDto getComment(Long commentId) {
        return boardMapper.selectCommentById(commentId.intValue());
    }

    @Override
    public void handleVote(Long commentId, String action, String previousVote) {
        int id = commentId.intValue();
        if (previousVote == null) {
            if ("like".equals(action))
                boardMapper.increaseLike(id);
            else
                boardMapper.increaseDislike(id);
        } else if (previousVote.equals(action)) {
            if ("like".equals(action))
                boardMapper.decreaseLike(id);
            else
                boardMapper.decreaseDislike(id);
        } else {
            if ("like".equals(action)) {
                boardMapper.decreaseDislike(id);
                boardMapper.increaseLike(id);
            } else {
                boardMapper.decreaseLike(id);
                boardMapper.increaseDislike(id);
            }
        }
    }

    private Board convertToBoard(BoardDto dto) {
        Board board = new Board();
        board.setRqstNo(dto.getRqstNo());
        board.setTitle(dto.getTitle());
        board.setCont(dto.getCont());
        board.setRqstId(dto.getRqstId());
        board.setGroupNo(dto.getGroupNo());
        board.setParentNo(dto.getParentNo());
        board.setDepth(dto.getDepth());
        board.setOrderNo(dto.getOrderNo());
        board.setSecret(dto.getSecret());
        board.setPassword(dto.getPassword());
        board.setBoardType(dto.getBoardType());
        return board;
    }
}
