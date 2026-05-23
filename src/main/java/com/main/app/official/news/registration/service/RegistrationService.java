package com.main.app.official.news.registration.service;

import com.main.app.common.dto.CommentDto;
import com.main.app.common.dto.FileDto;
import com.main.app.common.util.FileUploadUtil;
import com.main.app.common.util.PaginationUtil;
import com.main.app.official.news.registration.dto.RegistrationDto;
import com.main.app.official.news.registration.dto.RegistrationRequest;
import com.main.app.official.news.registration.mapper.RegistrationMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class RegistrationService {

    private final RegistrationMapper registrationMapper;

    @Value("${spring.servlet.multipart.location:c:/upload/}")
    private String uploadPath;

    public RegistrationService(RegistrationMapper registrationMapper) {
        this.registrationMapper = registrationMapper;
    }

    @SuppressWarnings("null")
    public Page<RegistrationDto> getBoardList(Pageable pageable, String searchType, String keyword) {
        List<RegistrationDto> list = registrationMapper.selectBoardList(pageable, searchType, keyword);
        long total = registrationMapper.countBoardList(searchType, keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public RegistrationDto getBoardDetail(String rqstNo, boolean increaseViewCount) {
        RegistrationDto board = registrationMapper.selectBoardDetail(rqstNo, increaseViewCount);
        if (board != null) {
            board.setFileList(registrationMapper.selectFileList(rqstNo));
        }
        return board;
    }

    @Transactional
    public void saveBoard(RegistrationRequest request, List<MultipartFile> files) {
        if (request.getRqstNo() == null || request.getRqstNo().isEmpty()) {
            request.setRqstNo(UUID.randomUUID().toString());

            if (request.getParentNo() != null && !request.getParentNo().isEmpty()) {
                RegistrationDto parent = registrationMapper.selectBoardDetail(request.getParentNo(), false);
                if (parent != null) {
                    request.setGroupNo(parent.getGroupNo());
                    request.setDepth(parent.getDepth() + 1);
                    registrationMapper.updateReplyOrder(parent.getGroupNo(), parent.getOrderNo());
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
        registrationMapper.deleteFiles(rqstNo);
        registrationMapper.deleteBoard(rqstNo);
    }

    public FileDto getFile(Long fileId) {
        return registrationMapper.selectFile(fileId);
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
        FileUploadUtil.saveFiles(boardNo, files, uploadPath, registrationMapper::insertFile);
    }
}
