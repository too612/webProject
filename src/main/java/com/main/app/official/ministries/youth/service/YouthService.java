package com.main.app.official.ministries.youth.service;

import com.main.app.common.dto.CommentDto;
import com.main.app.common.dto.FileDto;
import com.main.app.common.util.FileUploadUtil;
import com.main.app.common.util.PaginationUtil;
import com.main.app.official.ministries.youth.dto.YouthDto;
import com.main.app.official.ministries.youth.dto.YouthRequest;
import com.main.app.official.ministries.youth.mapper.YouthMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class YouthService {

    private final YouthMapper youthMapper;

    @Value("${spring.servlet.multipart.location:c:/upload/}")
    private String uploadPath;

    public YouthService(YouthMapper youthMapper) {
        this.youthMapper = youthMapper;
    }

    @SuppressWarnings("null")
    public Page<YouthDto> getBoardList(Pageable pageable, String searchType, String keyword) {
        List<YouthDto> list = youthMapper.selectBoardList(pageable, searchType, keyword);
        long total = youthMapper.countBoardList(searchType, keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public YouthDto getBoardDetail(String rqstNo, boolean increaseViewCount) {
        YouthDto board = youthMapper.selectBoardDetail(rqstNo, increaseViewCount);
        if (board != null) {
            board.setFileList(youthMapper.selectFileList(rqstNo));
        }
        return board;
    }

    @Transactional
    public void saveBoard(YouthRequest request, List<MultipartFile> files) {
        if (request.getRqstNo() == null || request.getRqstNo().isEmpty()) {
            request.setRqstNo(UUID.randomUUID().toString());

            if (request.getParentNo() != null && !request.getParentNo().isEmpty()) {
                YouthDto parent = youthMapper.selectBoardDetail(request.getParentNo(), false);
                if (parent != null) {
                    request.setGroupNo(parent.getGroupNo());
                    request.setDepth(parent.getDepth() + 1);
                    youthMapper.updateReplyOrder(parent.getGroupNo(), parent.getOrderNo());
                    request.setOrderNo(parent.getOrderNo() + 1);
                }
            } else {
                request.setGroupNo(request.getRqstNo());
                request.setDepth(0);
                request.setOrderNo(0);
            }

            youthMapper.insertBoard(request);
        } else {
            youthMapper.updateBoard(request);
        }

        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void updateBoard(YouthRequest request, List<MultipartFile> files) {
        youthMapper.updateBoard(request);
        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void deleteBoard(String rqstNo) {
        youthMapper.deleteComments(rqstNo);
        youthMapper.deleteFiles(rqstNo);
        youthMapper.deleteBoard(rqstNo);
    }

    public FileDto getFile(Long fileId) {
        return youthMapper.selectFile(fileId);
    }

    public List<CommentDto> getCommentList(String boardNo) {
        return youthMapper.selectCommentList(boardNo);
    }

    public void saveComment(CommentDto comment) {
        youthMapper.insertComment(comment);
    }

    public CommentDto getComment(Long commentId) {
        return youthMapper.selectCommentById(commentId.intValue());
    }

    public void handleVote(Long commentId, String action, String previousVote) {
        int id = commentId.intValue();
        if (previousVote == null) {
            if ("like".equals(action)) {
                youthMapper.increaseLike(id);
            } else {
                youthMapper.increaseDislike(id);
            }
            return;
        }

        if (previousVote.equals(action)) {
            if ("like".equals(action)) {
                youthMapper.decreaseLike(id);
            } else {
                youthMapper.decreaseDislike(id);
            }
            return;
        }

        if ("like".equals(action)) {
            youthMapper.decreaseDislike(id);
            youthMapper.increaseLike(id);
        } else {
            youthMapper.decreaseLike(id);
            youthMapper.increaseDislike(id);
        }
    }

    private void processFiles(String boardNo, List<MultipartFile> files) {
        FileUploadUtil.saveFiles(boardNo, files, uploadPath, youthMapper::insertFile);
    }
}