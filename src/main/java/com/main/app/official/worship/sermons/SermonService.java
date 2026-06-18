/**
 * @fileoverview 설교 게시판 비즈니스 로직 서비스
 * 
 * 확장 내용 (ERP 수준):
 * - 정렬 필드(sortField) 화이트리스트 검증 추가 (SQL Injection 방지)
 * - 페이징 파라미터(page, size)를 Map에 담아 Mapper로 전달
 */
package com.main.app.official.worship.sermons;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.main.app.common.comment.CommentService;
import com.main.app.common.comment.dto.CommentDto;
import com.main.app.common.attachment.AttachmentService;
import com.main.app.common.attachment.dto.AttachmentDto;
import com.main.app.common.util.PaginationUtil;
import com.main.app.official.worship.sermons.dto.SermonDto;
import com.main.app.official.worship.sermons.dto.SermonRequest;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SermonService {

    private final SermonMapper sermonMapper;
    private final PasswordEncoder passwordEncoder;
    private final AttachmentService fileService;
    private final CommentService commentService;

    // ★ 정렬 허용 필드 화이트리스트 (SQL Injection 방지)
    private static final List<String> ALLOWED_SORT_FIELDS = Arrays.asList(
            "created_at", "view_count", "title", "sermon_date", "author_id");

    public SermonService(SermonMapper sermonMapper, PasswordEncoder passwordEncoder,
            AttachmentService fileService, CommentService commentService) {
        this.sermonMapper = sermonMapper;
        this.passwordEncoder = passwordEncoder;
        this.fileService = fileService;
        this.commentService = commentService;
    }

    /**
     * 설교 목록 조회 (ERP 수준 페이징/정렬 지원)
     * 
     * @param page        요청 페이지 (0부터 시작)
     * @param size        페이지당 행 수
     * @param sortField   정렬 기준 필드 (화이트리스트 검증됨)
     * @param sortOrder   정렬 방향 (ASC/DESC)
     * @param searchType  검색 유형
     * @param keyword     검색어
     * @param worshipType 예배구분 필터
     * @return 페이징 처리된 설교 목록
     */
    @Transactional(readOnly = true)
    public Page<SermonDto> getBoardList(int page, int size, String sortField, String sortOrder,
            String searchType, String keyword, String worshipType) {

        // ★ 1. 정렬 필드 검증 (화이트리스트에 없으면 기본값 사용)
        String validSortField = "created_at"; // 기본값
        if (StringUtils.hasText(sortField) && ALLOWED_SORT_FIELDS.contains(sortField)) {
            validSortField = sortField;
        } else if (StringUtils.hasText(sortField)) {
            log.warn("Invalid sortField attempted: {}, falling back to default", sortField);
        }

        // ★ 2. 정렬 방향 검증 (ASC 또는 DESC만 허용)
        String validSortOrder = "ASC";
        if (StringUtils.hasText(sortOrder)
                && (sortOrder.equalsIgnoreCase("ASC") || sortOrder.equalsIgnoreCase("DESC"))) {
            validSortOrder = sortOrder.toUpperCase();
        }

        // ★ 3. 파라미터 Map 구성
        Map<String, Object> params = new HashMap<>();
        params.put("searchType", searchType);
        params.put("keyword", keyword);
        params.put("worshipType", worshipType);
        params.put("size", size);
        params.put("offset", page * size);
        params.put("sortField", validSortField); // ★ Mapper에서 ORDER BY 동적 처리
        params.put("sortOrder", validSortOrder); // ★ Mapper에서 ORDER BY 동적 처리

        // ★ 4. Mapper 호출
        List<SermonDto> list = sermonMapper.selectBoardList(params);
        long total = sermonMapper.countBoardList(params);

        // ★ 5. Spring Data Page 객체로 변환하여 반환
        Pageable pageable = PageRequest.of(page, size);
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
                            ? Long.parseLong(parent.getGroupNo())
                            : request.getParentNo();
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

    public AttachmentDto getFile(Long fileId) {
        return fileService.getFile(fileId);
    }

    public List<AttachmentDto> getFileList(String rqstNo) {
        return fileService.getFileList("sermon", rqstNo);
    }

    public List<CommentDto> getCommentList(String boardNo) {
        if (parseSermonId(boardNo) == null)
            return List.of();
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