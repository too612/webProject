package com.main.app.official.worship.sermons;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
import com.main.app.official.worship.sermons.dto.SermonDto;
import com.main.app.official.worship.sermons.dto.SermonRequest;

@Service
public class SermonService {

    private final SermonMapper sermonMapper;

    @Value("${spring.servlet.multipart.location:c:/upload/}")
    private String uploadPath;

    public SermonService(SermonMapper sermonMapper) {
        this.sermonMapper = sermonMapper;
    }

    public Page<SermonDto> getBoardList(Pageable pageable, String searchType, String keyword) {
        Map<String, Object> params = new HashMap<>();
        params.put("searchType", searchType);
        params.put("keyword", keyword);
        params.put("size", pageable.getPageSize());
        params.put("offset", pageable.getOffset());
        params.put("boardType", "SERMONS");

        List<SermonDto> list = sermonMapper.selectBoardList(params);
        long total = sermonMapper.countBoardList(params);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public SermonDto getBoardDetail(String rqstNo, boolean increaseViewCount) {
        Map<String, Object> params = new HashMap<>();
        params.put("rqstNo", rqstNo);
        params.put("boardType", "SERMONS");

        if (increaseViewCount) {
            sermonMapper.updateReadCount(params);
        }

        SermonDto board = sermonMapper.selectBoardDetail(params);
        if (board != null) {
            board.setFileList(sermonMapper.selectFileList(rqstNo));
        }
        return board;
    }

    @Transactional
    public void saveBoard(SermonRequest request, List<MultipartFile> files) {
        if (request.getRqstNo() == null || request.getRqstNo().isEmpty()) {
            request.setRqstNo(UUID.randomUUID().toString());

            if (request.getParentNo() != null && !request.getParentNo().isEmpty()) {
                Map<String, Object> parentParams = new HashMap<>();
                parentParams.put("rqstNo", request.getParentNo());
                parentParams.put("boardType", "SERMONS");

                SermonDto parent = sermonMapper.selectBoardDetail(parentParams);
                if (parent != null) {
                    request.setGroupNo(parent.getGroupNo());
                    request.setDepth(parent.getDepth() + 1);
                    Map<String, Object> replyOrderParams = new HashMap<>();
                    replyOrderParams.put("groupNo", parent.getGroupNo());
                    replyOrderParams.put("orderNo", parent.getOrderNo());
                    sermonMapper.updateReplyOrder(replyOrderParams);
                    request.setOrderNo(parent.getOrderNo() + 1);
                }
            } else {
                request.setGroupNo(request.getRqstNo());
                request.setDepth(0);
                request.setOrderNo(0);
            }

            sermonMapper.insertBoard(request);
        } else {
            sermonMapper.updateBoard(request);
        }

        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void updateBoard(SermonRequest request, List<MultipartFile> files) {
        sermonMapper.updateBoard(request);
        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void deleteBoard(String rqstNo) {
        sermonMapper.deleteComments(rqstNo);
        sermonMapper.deleteFiles(rqstNo);
        sermonMapper.deleteBoard(rqstNo);
    }

    public FileDto getFile(Long fileId) {
        return sermonMapper.selectFile(fileId);
    }

    public List<CommentDto> getCommentList(String boardNo) {
        return sermonMapper.selectCommentList(boardNo);
    }

    public void saveComment(CommentDto comment) {
        sermonMapper.insertComment(comment);
    }

    public CommentDto getComment(Long commentId) {
        return sermonMapper.selectCommentById(commentId.intValue());
    }

    public void handleVote(Long commentId, String action, String previousVote) {
        int id = commentId.intValue();
        if (previousVote == null) {
            if ("like".equals(action)) {
                sermonMapper.increaseLike(id);
            } else {
                sermonMapper.increaseDislike(id);
            }
            return;
        }

        if (previousVote.equals(action)) {
            if ("like".equals(action)) {
                sermonMapper.decreaseLike(id);
            } else {
                sermonMapper.decreaseDislike(id);
            }
            return;
        }

        if ("like".equals(action)) {
            sermonMapper.decreaseDislike(id);
            sermonMapper.increaseLike(id);
        } else {
            sermonMapper.decreaseLike(id);
            sermonMapper.increaseDislike(id);
        }
    }

    private void processFiles(String boardNo, List<MultipartFile> files) {
        FileUploadUtil.saveFiles(boardNo, files, uploadPath, sermonMapper::insertFile);
    }
}
