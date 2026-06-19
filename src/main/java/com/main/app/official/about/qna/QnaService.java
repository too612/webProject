package com.main.app.official.about.qna;

import com.main.app.common.dto.CommentDto;
import com.main.app.common.attachment.dto.AttachmentDto;
import com.main.app.common.attachment.AttachmentService;
import com.main.app.common.util.PaginationUtil;
import com.main.app.official.about.qna.dto.QnaDto;
import com.main.app.official.about.qna.dto.QnaRequest;
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
public class QnaService {

    private final QnaMapper qnaMapper;
    private final AttachmentService fileService;

    public QnaService(QnaMapper qnaMapper, AttachmentService fileService) {
        this.qnaMapper = qnaMapper;
        this.fileService = fileService;
    }

    @SuppressWarnings("null")
    public Page<QnaDto> getBoardList(Pageable pageable, String searchType, String keyword) {
        Map<String, Object> params = new HashMap<>();
        params.put("searchType", searchType);
        params.put("keyword", keyword);
        params.put("size", pageable.getPageSize());
        params.put("offset", pageable.getOffset());

        List<QnaDto> list = qnaMapper.selectBoardList(params);
        long total = qnaMapper.countBoardList(params);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public QnaDto getBoardDetail(String rqstNo, boolean increaseViewCount) {
        Map<String, Object> params = new HashMap<>();
        params.put("rqstNo", rqstNo);

        if (increaseViewCount) {
            qnaMapper.updateReadCount(params);
        }

        QnaDto board = qnaMapper.selectBoardDetail(params);
        if (board != null) {
           // board.setFileList(fileService.getFileList(rqstNo));
        }
        return board;
    }

    @Transactional
    public void saveBoard(QnaRequest request, List<MultipartFile> files) {
        if (request.getRqstNo() == null || request.getRqstNo().isEmpty()) {
            request.setRqstNo(UUID.randomUUID().toString());

            if (request.getParentNo() != null && !request.getParentNo().isEmpty()) {
                Map<String, Object> parentParams = new HashMap<>();
                parentParams.put("rqstNo", request.getParentNo());

                QnaDto parent = qnaMapper.selectBoardDetail(parentParams);
                if (parent != null) {
                    request.setGroupNo(parent.getGroupNo());
                    request.setDepth(parent.getDepth() + 1);
                    Map<String, Object> replyOrderParams = new HashMap<>();
                    replyOrderParams.put("groupNo", parent.getGroupNo());
                    replyOrderParams.put("orderNo", parent.getOrderNo());
                    qnaMapper.updateReplyOrder(replyOrderParams);
                    request.setOrderNo(parent.getOrderNo() + 1);
                }
            } else {
                request.setGroupNo(request.getRqstNo());
                request.setDepth(0);
                request.setOrderNo(0);
            }

            qnaMapper.insertBoard(request);
        } else {
            qnaMapper.updateBoard(request);
        }

        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void updateBoard(QnaRequest request, List<MultipartFile> files) {
        qnaMapper.updateBoard(request);
        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void deleteBoard(String rqstNo) {
        qnaMapper.deleteComments(rqstNo);
       // fileService.softDeleteFilesByBoardNo(rqstNo);
        qnaMapper.deleteBoard(rqstNo);
    }

    public AttachmentDto getFile(Long fileId) {
        return fileService.getFile(fileId);
    }

    public List<CommentDto> getCommentList(String boardNo) {
        return qnaMapper.selectCommentList(boardNo);
    }

    public void saveComment(CommentDto comment) {
        qnaMapper.insertComment(comment);
    }

    public CommentDto getComment(Long commentId) {
        return qnaMapper.selectCommentById(commentId.intValue());
    }

    public void handleVote(Long commentId, String action, String previousVote) {
        int id = commentId.intValue();
        if (previousVote == null) {
            if ("like".equals(action)) {
                qnaMapper.increaseLike(id);
            } else {
                qnaMapper.increaseDislike(id);
            }
            return;
        }

        if (previousVote.equals(action)) {
            if ("like".equals(action)) {
                qnaMapper.decreaseLike(id);
            } else {
                qnaMapper.decreaseDislike(id);
            }
            return;
        }

        if ("like".equals(action)) {
            qnaMapper.decreaseDislike(id);
            qnaMapper.increaseLike(id);
        } else {
            qnaMapper.decreaseLike(id);
            qnaMapper.increaseDislike(id);
        }
    }

    private void processFiles(String boardNo, List<MultipartFile> files) {
      //  fileService.uploadFiles(boardNo, files, "board", "qna", null, null);
    }
}