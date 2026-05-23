package com.main.app.community.qna;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.main.app.common.dto.CommentDto;
import com.main.app.common.dto.FileDto;
import com.main.app.common.util.FileUploadUtil;
import com.main.app.common.util.PaginationUtil;
import com.main.app.community.qna.dto.QnaDto;
import com.main.app.community.qna.dto.QnaRequest;

@Service("communityQnaService")
public class QnaService {

    private final QnaMapper qnaMapper;

    @Value("${spring.servlet.multipart.location:c:/upload/}")
    private String uploadPath;

    public QnaService(QnaMapper qnaMapper) {
        this.qnaMapper = qnaMapper;
    }

    @SuppressWarnings("null")
    public Page<QnaDto> getBoardList(Pageable pageable, String searchType, String keyword) {
        List<QnaDto> list = qnaMapper.selectBoardList(pageable, searchType, keyword);
        long total = qnaMapper.countBoardList(searchType, keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public QnaDto getBoardDetail(String rqstNo, boolean increaseViewCount) {
        QnaDto board = qnaMapper.selectBoardDetail(rqstNo, increaseViewCount);
        if (board != null) {
            board.setFileList(qnaMapper.selectFileList(rqstNo));
        }
        return board;
    }

    @Transactional
    public void saveBoard(QnaRequest request, List<MultipartFile> files) {
        if (request.getRqstNo() == null || request.getRqstNo().isEmpty()) {
            request.setRqstNo(UUID.randomUUID().toString());

            if (request.getParentNo() != null && !request.getParentNo().isEmpty()) {
                QnaDto parent = qnaMapper.selectBoardDetail(request.getParentNo(), false);
                if (parent != null) {
                    request.setGroupNo(parent.getGroupNo());
                    request.setDepth(parent.getDepth() + 1);
                    qnaMapper.updateReplyOrder(parent.getGroupNo(), parent.getOrderNo());
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
        qnaMapper.deleteFiles(rqstNo);
        qnaMapper.deleteBoard(rqstNo);
    }

    public FileDto getFile(Long fileId) {
        return qnaMapper.selectFile(fileId);
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
        FileUploadUtil.saveFiles(boardNo, files, uploadPath, qnaMapper::insertFile);
    }
}
