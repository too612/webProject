package com.main.app.official.news.registration;

import com.main.app.common.dto.CommentDto;
import com.main.app.common.file.dto.FileDto;
import com.main.app.common.file.FileService;
import com.main.app.common.util.PaginationUtil;
import com.main.app.official.news.registration.dto.RegistrationDto;
import com.main.app.official.news.registration.dto.RegistrationRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class RegistrationService {

    private final RegistrationMapper registrationMapper;
    private final FileService fileService;

    public RegistrationService(RegistrationMapper registrationMapper, FileService fileService) {
        this.registrationMapper = registrationMapper;
        this.fileService = fileService;
    }

    @SuppressWarnings("null")
    public Page<RegistrationDto> getBoardList(Pageable pageable, String searchType, String keyword) {
        Map<String, Object> params = new HashMap<>();
        params.put("searchType", searchType);
        params.put("keyword", keyword);
        params.put("size", pageable.getPageSize());
        params.put("offset", pageable.getOffset());

        List<RegistrationDto> list = registrationMapper.selectBoardList(params);
        long total = registrationMapper.countBoardList(params);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public RegistrationDto getBoardDetail(String rqstNo, boolean increaseViewCount) {
        Map<String, Object> params = new HashMap<>();
        params.put("rqstNo", rqstNo);

        if (increaseViewCount) {
            registrationMapper.updateReadCount(params);
        }

        RegistrationDto board = registrationMapper.selectBoardDetail(params);
        if (board != null) {
            board.setFileList(fileService.getFileList(rqstNo));
        }
        return board;
    }

    @Transactional
    public void saveBoard(RegistrationRequest request, List<MultipartFile> files) {
        if (request.getRqstNo() == null || request.getRqstNo().isEmpty()) {
            request.setRqstNo(UUID.randomUUID().toString());

            if (request.getParentNo() != null && !request.getParentNo().isEmpty()) {
                Map<String, Object> parentParams = new HashMap<>();
                parentParams.put("rqstNo", request.getParentNo());

                RegistrationDto parent = registrationMapper.selectBoardDetail(parentParams);
                if (parent != null) {
                    request.setGroupNo(parent.getGroupNo());
                    request.setDepth(parent.getDepth() + 1);
                    Map<String, Object> replyOrderParams = new HashMap<>();
                    replyOrderParams.put("groupNo", parent.getGroupNo());
                    replyOrderParams.put("orderNo", parent.getOrderNo());
                    registrationMapper.updateReplyOrder(replyOrderParams);
                    request.setOrderNo(parent.getOrderNo() + 1);
                }
            } else {
                request.setGroupNo(request.getRqstNo());
                request.setDepth(0);
                request.setOrderNo(0);
            }

            registrationMapper.insertBoard(request);
        } else {
            registrationMapper.updateBoard(request);
        }

        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void updateBoard(RegistrationRequest request, List<MultipartFile> files) {
        registrationMapper.updateBoard(request);
        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void deleteBoard(String rqstNo) {
        registrationMapper.deleteComments(rqstNo);
        fileService.softDeleteFilesByBoardNo(rqstNo);
        registrationMapper.deleteBoard(rqstNo);
    }

    public FileDto getFile(Long fileId) {
        return fileService.getFile(fileId);
    }

    public List<CommentDto> getCommentList(String boardNo) {
        return registrationMapper.selectCommentList(boardNo);
    }

    public void saveComment(CommentDto comment) {
        registrationMapper.insertComment(comment);
    }

    public CommentDto getComment(Long commentId) {
        return registrationMapper.selectCommentById(commentId.intValue());
    }

    public void handleVote(Long commentId, String action, String previousVote) {
        int id = commentId.intValue();
        if (previousVote == null) {
            if ("like".equals(action)) {
                registrationMapper.increaseLike(id);
            } else {
                registrationMapper.increaseDislike(id);
            }
            return;
        }

        if (previousVote.equals(action)) {
            if ("like".equals(action)) {
                registrationMapper.decreaseLike(id);
            } else {
                registrationMapper.decreaseDislike(id);
            }
            return;
        }

        if ("like".equals(action)) {
            registrationMapper.decreaseDislike(id);
            registrationMapper.increaseLike(id);
        } else {
            registrationMapper.decreaseLike(id);
            registrationMapper.increaseDislike(id);
        }
    }

    private void processFiles(String boardNo, List<MultipartFile> files) {
        fileService.uploadFiles(boardNo, files, "board", "registration", null, null);
    }
}

