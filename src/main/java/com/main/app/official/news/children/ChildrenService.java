package com.main.app.official.news.children;

import com.main.app.common.dto.CommentDto;
import com.main.app.common.attachment.dto.AttachmentDto;
import com.main.app.common.attachment.AttachmentService;
import com.main.app.common.util.PaginationUtil;
import com.main.app.official.news.children.dto.ChildrenDto;
import com.main.app.official.news.children.dto.ChildrenRequest;
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
public class ChildrenService {

    private final ChildrenMapper childrenMapper;
    private final AttachmentService fileService;

    public ChildrenService(ChildrenMapper childrenMapper, AttachmentService fileService) {
        this.childrenMapper = childrenMapper;
        this.fileService = fileService;
    }

    @SuppressWarnings("null")
    public Page<ChildrenDto> getBoardList(Pageable pageable, String searchType, String keyword) {
        Map<String, Object> params = new HashMap<>();
        params.put("searchType", searchType);
        params.put("keyword", keyword);
        params.put("size", pageable.getPageSize());
        params.put("offset", pageable.getOffset());
        List<ChildrenDto> list = childrenMapper.selectBoardList(params);
        long total = childrenMapper.countBoardList(params);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public ChildrenDto getBoardDetail(String rqstNo, boolean increaseViewCount) {
        Map<String, Object> params = new HashMap<>();
        params.put("rqstNo", rqstNo);
        if (increaseViewCount) childrenMapper.updateReadCount(params);
        ChildrenDto board = childrenMapper.selectBoardDetail(params);
        if (board != null) { /* board.setFileList(fileService.getFileList(rqstNo)); */ }
        return board;
    }

    @Transactional
    public void saveBoard(ChildrenRequest request, List<MultipartFile> files) {
        if (request.getRqstNo() == null || request.getRqstNo().isEmpty()) {
            request.setRqstNo(UUID.randomUUID().toString());
            if (request.getParentNo() != null && !request.getParentNo().isEmpty()) {
                Map<String, Object> parentParams = new HashMap<>();
                parentParams.put("rqstNo", request.getParentNo());
                ChildrenDto parent = childrenMapper.selectBoardDetail(parentParams);
                if (parent != null) {
                    request.setGroupNo(parent.getGroupNo());
                    request.setDepth(parent.getDepth() + 1);
                    Map<String, Object> replyOrderParams = new HashMap<>();
                    replyOrderParams.put("groupNo", parent.getGroupNo());
                    replyOrderParams.put("orderNo", parent.getOrderNo());
                    childrenMapper.updateReplyOrder(replyOrderParams);
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
        childrenMapper.deleteBoard(rqstNo);
    }

    public AttachmentDto getFile(Long fileId) { return fileService.getFile(fileId); }
    public List<CommentDto> getCommentList(String boardNo) { return childrenMapper.selectCommentList(boardNo); }
    public void saveComment(CommentDto comment) { childrenMapper.insertComment(comment); }
    public CommentDto getComment(Long commentId) { return childrenMapper.selectCommentById(commentId.intValue()); }

    public void handleVote(Long commentId, String action, String previousVote) {
        int id = commentId.intValue();
        if (previousVote == null) { if ("like".equals(action)) childrenMapper.increaseLike(id); else childrenMapper.increaseDislike(id); return; }
        if (previousVote.equals(action)) { if ("like".equals(action)) childrenMapper.decreaseLike(id); else childrenMapper.decreaseDislike(id); return; }
        if ("like".equals(action)) { childrenMapper.decreaseDislike(id); childrenMapper.increaseLike(id); }
        else { childrenMapper.decreaseLike(id); childrenMapper.increaseDislike(id); }
    }

    private void processFiles(String boardNo, List<MultipartFile> files) { /* fileService.uploadFiles(...) */ }
}