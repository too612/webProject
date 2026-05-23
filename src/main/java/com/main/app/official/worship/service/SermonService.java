package com.main.app.official.worship.service;

import com.main.app.common.dto.CommentDto;
import com.main.app.common.dto.FileDto;
import com.main.app.common.util.FileUploadUtil;
import com.main.app.common.util.PaginationUtil;
import com.main.app.official.worship.dto.SermonDto;
import com.main.app.official.worship.dto.SermonRequest;
import com.main.app.official.worship.mapper.SermonMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class SermonService {

    private final SermonMapper sermonMapper;

    @Value("${spring.servlet.multipart.location:c:/upload/}")
    private String uploadPath;

    public SermonService(SermonMapper sermonMapper) {
        this.sermonMapper = sermonMapper;
    }

    public Page<SermonDto> getBoardList(Pageable pageable, String searchType, String keyword) {
        List<SermonDto> list = sermonMapper.selectBoardList(pageable, searchType, keyword);
        long total = sermonMapper.countBoardList(searchType, keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public SermonDto getBoardDetail(String rqstNo, boolean increaseViewCount) {
        SermonDto board = sermonMapper.selectBoardDetail(rqstNo, increaseViewCount);
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
                SermonDto parent = sermonMapper.selectBoardDetail(request.getParentNo(), false);
                if (parent != null) {
                    request.setGroupNo(parent.getGroupNo());
                    request.setDepth(parent.getDepth() + 1);
                    sermonMapper.updateReplyOrder(parent.getGroupNo(), parent.getOrderNo());
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
