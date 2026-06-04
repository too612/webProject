package com.main.app.official.news.event;

import com.main.app.common.dto.CommentDto;
import com.main.app.common.file.dto.FileDto;
import com.main.app.common.file.FileService;
import com.main.app.common.util.PaginationUtil;
import com.main.app.official.news.event.dto.EventDto;
import com.main.app.official.news.event.dto.EventRequest;
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
public class EventService {

    private final EventMapper eventMapper;
    private final FileService fileService;

    public EventService(EventMapper eventMapper, FileService fileService) {
        this.eventMapper = eventMapper;
        this.fileService = fileService;
    }

    @SuppressWarnings("null")
    public Page<EventDto> getBoardList(Pageable pageable, String searchType, String keyword) {
        Map<String, Object> params = new HashMap<>();
        params.put("searchType", searchType);
        params.put("keyword", keyword);
        params.put("size", pageable.getPageSize());
        params.put("offset", pageable.getOffset());

        List<EventDto> list = eventMapper.selectBoardList(params);
        long total = eventMapper.countBoardList(params);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public EventDto getBoardDetail(String rqstNo, boolean increaseViewCount) {
        Map<String, Object> params = new HashMap<>();
        params.put("rqstNo", rqstNo);

        if (increaseViewCount) {
            eventMapper.updateReadCount(params);
        }

        EventDto board = eventMapper.selectBoardDetail(params);
        if (board != null) {
            board.setFileList(fileService.getFileList(rqstNo));
        }
        return board;
    }

    @Transactional
    public void saveBoard(EventRequest request, List<MultipartFile> files) {
        if (request.getRqstNo() == null || request.getRqstNo().isEmpty()) {
            request.setRqstNo(UUID.randomUUID().toString());

            if (request.getParentNo() != null && !request.getParentNo().isEmpty()) {
                Map<String, Object> parentParams = new HashMap<>();
                parentParams.put("rqstNo", request.getParentNo());

                EventDto parent = eventMapper.selectBoardDetail(parentParams);
                if (parent != null) {
                    request.setGroupNo(parent.getGroupNo());
                    request.setDepth(parent.getDepth() + 1);
                    Map<String, Object> replyOrderParams = new HashMap<>();
                    replyOrderParams.put("groupNo", parent.getGroupNo());
                    replyOrderParams.put("orderNo", parent.getOrderNo());
                    eventMapper.updateReplyOrder(replyOrderParams);
                    request.setOrderNo(parent.getOrderNo() + 1);
                }
            } else {
                request.setGroupNo(request.getRqstNo());
                request.setDepth(0);
                request.setOrderNo(0);
            }

            eventMapper.insertBoard(request);
        } else {
            eventMapper.updateBoard(request);
        }

        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void updateBoard(EventRequest request, List<MultipartFile> files) {
        eventMapper.updateBoard(request);
        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void deleteBoard(String rqstNo) {
        eventMapper.deleteComments(rqstNo);
        fileService.softDeleteFilesByBoardNo(rqstNo);
        eventMapper.deleteBoard(rqstNo);
    }

    public FileDto getFile(Long fileId) {
        return fileService.getFile(fileId);
    }

    public List<CommentDto> getCommentList(String boardNo) {
        return eventMapper.selectCommentList(boardNo);
    }

    public void saveComment(CommentDto comment) {
        eventMapper.insertComment(comment);
    }

    public CommentDto getComment(Long commentId) {
        return eventMapper.selectCommentById(commentId.intValue());
    }

    public void handleVote(Long commentId, String action, String previousVote) {
        int id = commentId.intValue();
        if (previousVote == null) {
            if ("like".equals(action)) {
                eventMapper.increaseLike(id);
            } else {
                eventMapper.increaseDislike(id);
            }
            return;
        }

        if (previousVote.equals(action)) {
            if ("like".equals(action)) {
                eventMapper.decreaseLike(id);
            } else {
                eventMapper.decreaseDislike(id);
            }
            return;
        }

        if ("like".equals(action)) {
            eventMapper.decreaseDislike(id);
            eventMapper.increaseLike(id);
        } else {
            eventMapper.decreaseLike(id);
            eventMapper.increaseDislike(id);
        }
    }

    private void processFiles(String boardNo, List<MultipartFile> files) {
        fileService.uploadFiles(boardNo, files, "board", "event", null, null);
    }
}

