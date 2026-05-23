package com.main.app.official.ministries.children.service;

import com.main.app.common.dto.CommentDto;
import com.main.app.common.dto.FileDto;
import com.main.app.common.util.FileUploadUtil;
import com.main.app.common.util.PaginationUtil;
import com.main.app.official.ministries.children.dto.ChildrenDto;
import com.main.app.official.ministries.children.dto.ChildrenRequest;
import com.main.app.official.ministries.children.mapper.ChildrenMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class ChildrenService {

    private final ChildrenMapper childrenMapper;

    @Value("${spring.servlet.multipart.location:c:/upload/}")
    private String uploadPath;

    public ChildrenService(ChildrenMapper childrenMapper) {
        this.childrenMapper = childrenMapper;
    }

    @SuppressWarnings("null")
    public Page<ChildrenDto> getBoardList(Pageable pageable, String searchType, String keyword) {
        List<ChildrenDto> list = childrenMapper.selectBoardList(pageable, searchType, keyword);
        long total = childrenMapper.countBoardList(searchType, keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public ChildrenDto getBoardDetail(String rqstNo, boolean increaseViewCount) {
        ChildrenDto board = childrenMapper.selectBoardDetail(rqstNo, increaseViewCount);
        if (board != null) {
            board.setFileList(childrenMapper.selectFileList(rqstNo));
        }
        return board;
    }

    @Transactional
    public void saveBoard(ChildrenRequest request, List<MultipartFile> files) {
        if (request.getRqstNo() == null || request.getRqstNo().isEmpty()) {
            request.setRqstNo(UUID.randomUUID().toString());

            if (request.getParentNo() != null && !request.getParentNo().isEmpty()) {
                ChildrenDto parent = childrenMapper.selectBoardDetail(request.getParentNo(), false);
                if (parent != null) {
                    request.setGroupNo(parent.getGroupNo());
                    request.setDepth(parent.getDepth() + 1);
                    childrenMapper.updateReplyOrder(parent.getGroupNo(), parent.getOrderNo());
                    request.setOrderNo(parent.getOrderNo() + 1);
                }
            } else {
                request.setGroupNo(request.getRqstNo());
                request.setDepth(0);
                request.setOrderNo(0);
            }

            childrenMapper.insertBoard(request);
        } else {
            childrenMapper.updateBoard(request);
        }

        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void updateBoard(ChildrenRequest request, List<MultipartFile> files) {
        childrenMapper.updateBoard(request);
        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void deleteBoard(String rqstNo) {
        childrenMapper.deleteComments(rqstNo);
        childrenMapper.deleteFiles(rqstNo);
        childrenMapper.deleteBoard(rqstNo);
    }

    public FileDto getFile(Long fileId) {
        return childrenMapper.selectFile(fileId);
    }

    public List<CommentDto> getCommentList(String boardNo) {
        return childrenMapper.selectCommentList(boardNo);
    }

    public void saveComment(CommentDto comment) {
        childrenMapper.insertComment(comment);
    }

    public CommentDto getComment(Long commentId) {
        return childrenMapper.selectCommentById(commentId.intValue());
    }

    public void handleVote(Long commentId, String action, String previousVote) {
        int id = commentId.intValue();
        if (previousVote == null) {
            if ("like".equals(action)) {
                childrenMapper.increaseLike(id);
            } else {
                childrenMapper.increaseDislike(id);
            }
            return;
        }

        if (previousVote.equals(action)) {
            if ("like".equals(action)) {
                childrenMapper.decreaseLike(id);
            } else {
                childrenMapper.decreaseDislike(id);
            }
            return;
        }

        if ("like".equals(action)) {
            childrenMapper.decreaseDislike(id);
            childrenMapper.increaseLike(id);
        } else {
            childrenMapper.decreaseLike(id);
            childrenMapper.increaseDislike(id);
        }
    }

    private void processFiles(String boardNo, List<MultipartFile> files) {
        FileUploadUtil.saveFiles(boardNo, files, uploadPath, childrenMapper::insertFile);
    }
}
