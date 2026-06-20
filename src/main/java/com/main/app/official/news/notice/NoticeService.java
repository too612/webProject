package com.main.app.official.news.notice;

import com.main.app.common.dto.CommentDto;
import com.main.app.common.attachment.dto.AttachmentDto;
import com.main.app.common.attachment.AttachmentService;
import com.main.app.common.util.PaginationUtil;
import com.main.app.official.news.notice.dto.NoticeDto;
import com.main.app.official.news.notice.dto.NoticeRequest;
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
public class NoticeService {
    private final NoticeMapper noticeMapper;
    private final AttachmentService fileService;
    public NoticeService(NoticeMapper noticeMapper, AttachmentService fileService) { this.noticeMapper = noticeMapper; this.fileService = fileService; }

    public Page<NoticeDto> getBoardList(Pageable pageable, String searchType, String keyword) {
        Map<String, Object> params = new HashMap<>();
        params.put("searchType", searchType); params.put("keyword", keyword);
        params.put("size", pageable.getPageSize()); params.put("offset", pageable.getOffset());
        return PaginationUtil.toPage(noticeMapper.selectBoardList(params), pageable, noticeMapper.countBoardList(params));
    }

    public NoticeDto getBoardDetail(String rqstNo, boolean increaseViewCount) {
        Map<String, Object> params = new HashMap<>(); params.put("rqstNo", rqstNo);
        if (increaseViewCount) noticeMapper.updateReadCount(params);
        return noticeMapper.selectBoardDetail(params);
    }

    @Transactional
    public void saveBoard(NoticeRequest request, List<MultipartFile> files) {
        if (request.getRqstNo() == null || request.getRqstNo().isEmpty()) {
            request.setRqstNo(UUID.randomUUID().toString());
            if (request.getParentNo() != null && !request.getParentNo().isEmpty()) {
                Map<String, Object> pp = new HashMap<>(); pp.put("rqstNo", request.getParentNo());
                NoticeDto parent = noticeMapper.selectBoardDetail(pp);
                if (parent != null) {
                    request.setGroupNo(parent.getGroupNo()); request.setDepth(parent.getDepth() + 1);
                    Map<String, Object> ro = new HashMap<>(); ro.put("groupNo", parent.getGroupNo()); ro.put("orderNo", parent.getOrderNo());
                    noticeMapper.updateReplyOrder(ro); request.setOrderNo(parent.getOrderNo() + 1);
                }
            } else { request.setGroupNo(request.getRqstNo()); request.setDepth(0); request.setOrderNo(0); }
            noticeMapper.insertBoard(request);
        } else noticeMapper.updateBoard(request);
    }

    @Transactional public void updateBoard(NoticeRequest request, List<MultipartFile> files) { noticeMapper.updateBoard(request); }
    @Transactional public void deleteBoard(String rqstNo) { noticeMapper.deleteComments(rqstNo); noticeMapper.deleteBoard(rqstNo); }
    public AttachmentDto getFile(Long fileId) { return fileService.getFile(fileId); }
    public List<CommentDto> getCommentList(String boardNo) { return noticeMapper.selectCommentList(boardNo); }
    public void saveComment(CommentDto comment) { noticeMapper.insertComment(comment); }
    public CommentDto getComment(Long commentId) { return noticeMapper.selectCommentById(commentId.intValue()); }
    public void handleVote(Long commentId, String action, String previousVote) {
        int id = commentId.intValue();
        if (previousVote == null) { if ("like".equals(action)) noticeMapper.increaseLike(id); else noticeMapper.increaseDislike(id); return; }
        if (previousVote.equals(action)) { if ("like".equals(action)) noticeMapper.decreaseLike(id); else noticeMapper.decreaseDislike(id); return; }
        if ("like".equals(action)) { noticeMapper.decreaseDislike(id); noticeMapper.increaseLike(id); }
        else { noticeMapper.decreaseLike(id); noticeMapper.increaseDislike(id); }
    }
}