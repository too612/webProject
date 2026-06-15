package com.main.app.official.worship.sermons;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import com.main.app.common.comment.CommentService;
import com.main.app.common.comment.dto.CommentDto;
import com.main.app.common.file.FileService;
import com.main.app.common.file.dto.FileDto;
import com.main.app.common.util.PaginationUtil;
import com.main.app.official.worship.sermons.dto.SermonDto;
import com.main.app.official.worship.sermons.dto.SermonRequest;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SermonService {

    private final SermonMapper sermonMapper;
    private final PasswordEncoder passwordEncoder;

    private final FileService fileService;
    private final CommentService commentService;

    public SermonService(SermonMapper sermonMapper, PasswordEncoder passwordEncoder,
                         FileService fileService, CommentService commentService) {
        this.sermonMapper = sermonMapper;
        this.passwordEncoder = passwordEncoder;
        this.fileService = fileService;
        this.commentService = commentService;
    }

    @Transactional(readOnly = true)
    public Page<SermonDto> getBoardList(Pageable pageable, String searchType, String keyword, String worshipType) {
        Map<String, Object> params = new HashMap<>();
        params.put("searchType", searchType);
        params.put("keyword", keyword);
        params.put("worshipType", worshipType);
        params.put("size", pageable.getPageSize());
        params.put("offset", pageable.getOffset());

        List<SermonDto> list = sermonMapper.selectBoardList(params);
        long total = sermonMapper.countBoardList(params);
        return PaginationUtil.toPage(list, pageable, total);
    }

    @Transactional
    public SermonDto getBoardDetail(String rqstNo, boolean increaseViewCount) {
        Long sermonId = parseSermonId(rqstNo);
        if (sermonId == null) {
            return null;
        }

        Map<String, Object> params = new HashMap<>();
        params.put("rqstNo", sermonId);

        if (increaseViewCount) {
            sermonMapper.updateReadCount(params);
        }

        SermonDto board = sermonMapper.selectBoardDetail(params);
        if (board != null) {
            board.setFileList(fileService.getFileList("sermon", String.valueOf(sermonId)));
        }
        return board;
    }

    @Transactional
    public void saveBoard(SermonRequest request) {
        normalizeRequest(request);

        if (request.getRqstNo() == null) {
            // 답글인 경우 계층 정보 설정
            if (request.getParentNo() != null) {
                // 부모 게시글 조회
                java.util.Map<String, Object> params = new java.util.HashMap<>();
                params.put("rqstNo", request.getParentNo());
                SermonDto parent = sermonMapper.selectBoardDetail(params);

                if (parent != null) {
                    Long groupNo = parent.getGroupNo() != null
                            ? Long.parseLong(parent.getGroupNo()) : request.getParentNo();
                    int newOrderNo = (parent.getOrderNo() != null ? parent.getOrderNo() : 0) + 1;

                    // 같은 그룹 내 뒤에 있는 게시글 order_no 밀기
                    java.util.Map<String, Object> replyParams = new java.util.HashMap<>();
                    replyParams.put("groupNo", groupNo);
                    replyParams.put("orderNo", newOrderNo);
                    sermonMapper.updateReplyOrder(replyParams);

                    request.setGroupNo(groupNo);
                    request.setDepth((parent.getDepth() != null ? parent.getDepth() : 0) + 1);
                    request.setOrderNo(newOrderNo);
                }
            } else {
                // 원글 — group_no는 insert 후 자기 자신 sermon_id로 업데이트
                request.setDepth(0);
                request.setOrderNo(0);
            }

            sermonMapper.insertBoard(request);

            // 원글이면 group_no = 자기 자신 sermon_id
            if (request.getParentNo() == null && request.getRqstNo() != null) {
                java.util.Map<String, Object> updateGroup = new java.util.HashMap<>();
                updateGroup.put("rqstNo", request.getRqstNo());
                sermonMapper.updateGroupNo(updateGroup);
            }
        } else {
            sermonMapper.updateBoard(request);
        }
    }

    @Transactional
    public void updateBoard(SermonRequest request) {
        normalizeRequest(request);
        sermonMapper.updateBoard(request);
    }

    @Transactional
    public void deleteBoard(String rqstNo) {
        Long sermonId = parseSermonId(rqstNo);
        if (sermonId == null)
            return;
        commentService.softDeleteCommentsByRef("SERMONS", String.valueOf(sermonId));
        fileService.softDeleteFilesByRef("sermon", rqstNo);
        sermonMapper.softDeleteBoard(sermonId);
    }

    public FileDto getFile(Long fileId) {
        return fileService.getFile(fileId);
    }

    public List<FileDto> getFileList(String rqstNo) {
        return fileService.getFileList("sermon", rqstNo);
    }

    public List<CommentDto> getCommentList(String boardNo) {
        if (parseSermonId(boardNo) == null) return List.of();
        return commentService.getCommentList("SERMONS", boardNo);
    }

    public void saveComment(CommentDto comment) {
        commentService.saveComment(comment);
    }

    public CommentDto getComment(Long commentId) {
        return commentService.getComment(commentId);
    }

    public void handleVote(Long commentId, String action, String previousVote) {
        commentService.handleVote(commentId, action, previousVote);
    }

    public boolean isValidPassword(String rqstNo, String rawPassword) {
        if (!StringUtils.hasText(rawPassword)) {
            return false;
        }
        Map<String, Object> params = new HashMap<>();
        params.put("rqstNo", parseSermonId(rqstNo));
        SermonDto board = sermonMapper.selectBoardDetail(params);
        if (board == null || !StringUtils.hasText(board.getPassword())) {
            return false;
        }
        return passwordEncoder.matches(rawPassword, board.getPassword());
    }

    private void normalizeRequest(SermonRequest request) {
        if (!StringUtils.hasText(request.getPassword())) {
            request.setPassword(null);
            return;
        }
        if (isBcryptHash(request.getPassword())) {
            return;
        }
        request.setPassword(passwordEncoder.encode(request.getPassword()));
    }

    private boolean isBcryptHash(String value) {
        return StringUtils.hasText(value) && value.matches("^\\$2[aby]\\$.{56}$");
    }


    private Long parseSermonId(String rqstNo) {
        if (!StringUtils.hasText(rqstNo)) {
            return null;
        }
        try {
            return Long.parseLong(rqstNo);
        } catch (NumberFormatException ex) {
            return null;
        }
    }
}
