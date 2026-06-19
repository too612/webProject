package com.main.app.official.news.mission;

import com.main.app.common.dto.CommentDto;
import com.main.app.common.attachment.dto.AttachmentDto;
import com.main.app.common.attachment.AttachmentService;
import com.main.app.common.util.PaginationUtil;
import com.main.app.official.news.mission.dto.MissionDto;
import com.main.app.official.news.mission.dto.MissionRequest;
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
public class MissionService {
    private final MissionMapper missionMapper;
    private final AttachmentService fileService;
    public MissionService(MissionMapper missionMapper, AttachmentService fileService) { this.missionMapper = missionMapper; this.fileService = fileService; }

    public Page<MissionDto> getBoardList(Pageable pageable, String searchType, String keyword) {
        Map<String, Object> params = new HashMap<>(); params.put("searchType", searchType); params.put("keyword", keyword); params.put("size", pageable.getPageSize()); params.put("offset", pageable.getOffset());
        return PaginationUtil.toPage(missionMapper.selectBoardList(params), pageable, missionMapper.countBoardList(params));
    }
    public MissionDto getBoardDetail(String rqstNo, boolean increaseViewCount) {
        Map<String, Object> params = new HashMap<>(); params.put("rqstNo", rqstNo);
        if (increaseViewCount) missionMapper.updateReadCount(params);
        return missionMapper.selectBoardDetail(params);
    }
    @Transactional
    public void saveBoard(MissionRequest request, List<MultipartFile> files) {
        if (request.getRqstNo() == null || request.getRqstNo().isEmpty()) {
            request.setRqstNo(UUID.randomUUID().toString());
            if (request.getParentNo() != null && !request.getParentNo().isEmpty()) {
                Map<String, Object> pp = new HashMap<>(); pp.put("rqstNo", request.getParentNo());
                MissionDto p = missionMapper.selectBoardDetail(pp);
                if (p != null) { request.setGroupNo(p.getGroupNo()); request.setDepth(p.getDepth() + 1);
                    Map<String, Object> ro = new HashMap<>(); ro.put("groupNo", p.getGroupNo()); ro.put("orderNo", p.getOrderNo());
                    missionMapper.updateReplyOrder(ro); request.setOrderNo(p.getOrderNo() + 1); }
            } else { request.setGroupNo(request.getRqstNo()); request.setDepth(0); request.setOrderNo(0); }
            missionMapper.insertBoard(request);
        } else missionMapper.updateBoard(request);
        processFiles(request.getRqstNo(), files);
    }
    @Transactional public void updateBoard(MissionRequest request, List<MultipartFile> files) { missionMapper.updateBoard(request); processFiles(request.getRqstNo(), files); }
    @Transactional public void deleteBoard(String rqstNo) { missionMapper.deleteComments(rqstNo); missionMapper.deleteBoard(rqstNo); }
    public AttachmentDto getFile(Long fileId) { return fileService.getFile(fileId); }
    public List<CommentDto> getCommentList(String boardNo) { return missionMapper.selectCommentList(boardNo); }
    public void saveComment(CommentDto comment) { missionMapper.insertComment(comment); }
    public CommentDto getComment(Long commentId) { return missionMapper.selectCommentById(commentId.intValue()); }
    public void handleVote(Long commentId, String action, String previousVote) {
        int id = commentId.intValue();
        if (previousVote == null) { if ("like".equals(action)) missionMapper.increaseLike(id); else missionMapper.increaseDislike(id); return; }
        if (previousVote.equals(action)) { if ("like".equals(action)) missionMapper.decreaseLike(id); else missionMapper.decreaseDislike(id); return; }
        if ("like".equals(action)) { missionMapper.decreaseDislike(id); missionMapper.increaseLike(id); }
        else { missionMapper.decreaseLike(id); missionMapper.increaseDislike(id); }
    }
    private void processFiles(String boardNo, List<MultipartFile> files) {}
}