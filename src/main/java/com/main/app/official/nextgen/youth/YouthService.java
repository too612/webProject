package com.main.app.official.nextgen.youth;

import com.main.app.common.dto.CommentDto;
import com.main.app.common.attachment.dto.AttachmentDto;
import com.main.app.common.attachment.AttachmentService;
import com.main.app.common.util.PaginationUtil;
import com.main.app.official.nextgen.youth.dto.YouthDto;
import com.main.app.official.nextgen.youth.dto.YouthRequest;
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
public class YouthService {

    private final YouthMapper youthMapper;
    private final AttachmentService fileService;

    public YouthService(YouthMapper youthMapper, AttachmentService fileService) {
        this.youthMapper = youthMapper;
        this.fileService = fileService;
    }

    @SuppressWarnings("null")
    public Page<YouthDto> getBoardList(Pageable pageable, String searchType, String keyword) {
        Map<String, Object> params = new HashMap<>();
        params.put("searchType", searchType);
        params.put("keyword", keyword);
        params.put("size", pageable.getPageSize());
        params.put("offset", pageable.getOffset());

        List<YouthDto> list = youthMapper.selectBoardList(params);
        long total = youthMapper.countBoardList(params);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public YouthDto getBoardDetail(String rqstNo, boolean increaseViewCount) {
        Map<String, Object> params = new HashMap<>();
        params.put("rqstNo", rqstNo);

        if (increaseViewCount) {
            youthMapper.updateReadCount(params);
        }

        return youthMapper.selectBoardDetail(params);
    }

    @Transactional
    public void saveBoard(YouthRequest request, List<MultipartFile> files) {
        if (request.getRqstNo() == null || request.getRqstNo().isEmpty()) {
            request.setRqstNo(UUID.randomUUID().toString());

            if (request.getParentNo() != null && !request.getParentNo().isEmpty()) {
                Map<String, Object> parentParams = new HashMap<>();
                parentParams.put("rqstNo", request.getParentNo());

                YouthDto parent = youthMapper.selectBoardDetail(parentParams);
                if (parent != null) {
                    request.setGroupNo(parent.getGroupNo());
                    request.setDepth(parent.getDepth() + 1);
                    Map<String, Object> replyOrderParams = new HashMap<>();
                    replyOrderParams.put("groupNo", parent.getGroupNo());
                    replyOrderParams.put("orderNo", parent.getOrderNo());
                    youthMapper.updateReplyOrder(replyOrderParams);
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
        youthMapper.deleteBoard(rqstNo);
    }

    public AttachmentDto getFile(Long fileId) {
        return fileService.getFile(fileId);
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
    }
}