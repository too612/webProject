package com.main.app.official.news.announcement;

import com.main.app.common.dto.CommentDto;
import com.main.app.common.file.dto.FileDto;
import com.main.app.common.file.FileService;
import com.main.app.common.util.PaginationUtil;
import com.main.app.official.news.announcement.dto.AnnouncementDto;
import com.main.app.official.news.announcement.dto.AnnouncementRequest;
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
public class AnnouncementService {

    private final AnnouncementMapper announcementMapper;
    private final FileService fileService;

    public AnnouncementService(AnnouncementMapper announcementMapper, FileService fileService) {
        this.announcementMapper = announcementMapper;
        this.fileService = fileService;
    }

    @SuppressWarnings("null")
    public Page<AnnouncementDto> getBoardList(Pageable pageable, String searchType, String keyword) {
        Map<String, Object> params = new HashMap<>();
        params.put("searchType", searchType);
        params.put("keyword", keyword);
        params.put("size", pageable.getPageSize());
        params.put("offset", pageable.getOffset());

        List<AnnouncementDto> list = announcementMapper.selectBoardList(params);
        long total = announcementMapper.countBoardList(params);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public AnnouncementDto getBoardDetail(String rqstNo, boolean increaseViewCount) {
        Map<String, Object> params = new HashMap<>();
        params.put("rqstNo", rqstNo);

        if (increaseViewCount) {
            announcementMapper.updateReadCount(params);
        }

        AnnouncementDto board = announcementMapper.selectBoardDetail(params);
        if (board != null) {
            board.setFileList(fileService.getFileList(rqstNo));
        }
        return board;
    }

    @Transactional
    public void saveBoard(AnnouncementRequest request, List<MultipartFile> files) {
        if (request.getRqstNo() == null || request.getRqstNo().isEmpty()) {
            request.setRqstNo(UUID.randomUUID().toString());

            if (request.getParentNo() != null && !request.getParentNo().isEmpty()) {
                Map<String, Object> parentParams = new HashMap<>();
                parentParams.put("rqstNo", request.getParentNo());

                AnnouncementDto parent = announcementMapper.selectBoardDetail(parentParams);
                if (parent != null) {
                    request.setGroupNo(parent.getGroupNo());
                    request.setDepth(parent.getDepth() + 1);
                    Map<String, Object> replyOrderParams = new HashMap<>();
                    replyOrderParams.put("groupNo", parent.getGroupNo());
                    replyOrderParams.put("orderNo", parent.getOrderNo());
                    announcementMapper.updateReplyOrder(replyOrderParams);
                    request.setOrderNo(parent.getOrderNo() + 1);
                }
            } else {
                request.setGroupNo(request.getRqstNo());
                request.setDepth(0);
                request.setOrderNo(0);
            }

            announcementMapper.insertBoard(request);
        } else {
            announcementMapper.updateBoard(request);
        }

        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void updateBoard(AnnouncementRequest request, List<MultipartFile> files) {
        announcementMapper.updateBoard(request);
        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void deleteBoard(String rqstNo) {
        announcementMapper.deleteComments(rqstNo);
        fileService.softDeleteFilesByBoardNo(rqstNo);
        announcementMapper.deleteBoard(rqstNo);
    }

    public FileDto getFile(Long fileId) {
        return fileService.getFile(fileId);
    }

    public List<CommentDto> getCommentList(String boardNo) {
        return announcementMapper.selectCommentList(boardNo);
    }

    public void saveComment(CommentDto comment) {
        announcementMapper.insertComment(comment);
    }

    public CommentDto getComment(Long commentId) {
        return announcementMapper.selectCommentById(commentId.intValue());
    }

    public void handleVote(Long commentId, String action, String previousVote) {
        int id = commentId.intValue();
        if (previousVote == null) {
            if ("like".equals(action)) {
                announcementMapper.increaseLike(id);
            } else {
                announcementMapper.increaseDislike(id);
            }
            return;
        }

        if (previousVote.equals(action)) {
            if ("like".equals(action)) {
                announcementMapper.decreaseLike(id);
            } else {
                announcementMapper.decreaseDislike(id);
            }
            return;
        }

        if ("like".equals(action)) {
            announcementMapper.decreaseDislike(id);
            announcementMapper.increaseLike(id);
        } else {
            announcementMapper.decreaseLike(id);
            announcementMapper.increaseDislike(id);
        }
    }

    private void processFiles(String boardNo, List<MultipartFile> files) {
        fileService.uploadFiles(boardNo, files, "board", "announcement", null, null);
    }
}

