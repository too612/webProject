package com.main.app.official.ministries.mission;

import com.main.app.common.dto.CommentDto;
import com.main.app.common.dto.FileDto;
import com.main.app.common.util.FileUploadUtil;
import com.main.app.common.util.PaginationUtil;
import com.main.app.official.ministries.mission.dto.MissionDto;
import com.main.app.official.ministries.mission.dto.MissionRequest;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${spring.servlet.multipart.location:c:/upload/}")
    private String uploadPath;

    public MissionService(MissionMapper missionMapper) {
        this.missionMapper = missionMapper;
    }

    @SuppressWarnings("null")
    public Page<MissionDto> getBoardList(Pageable pageable, String searchType, String keyword) {
        Map<String, Object> params = new HashMap<>();
        params.put("searchType", searchType);
        params.put("keyword", keyword);
        params.put("size", pageable.getPageSize());
        params.put("offset", pageable.getOffset());

        List<MissionDto> list = missionMapper.selectBoardList(params);
        long total = missionMapper.countBoardList(params);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public MissionDto getBoardDetail(String rqstNo, boolean increaseViewCount) {
        Map<String, Object> params = new HashMap<>();
        params.put("rqstNo", rqstNo);

        if (increaseViewCount) {
            missionMapper.updateReadCount(params);
        }

        MissionDto board = missionMapper.selectBoardDetail(params);
        if (board != null) {
            board.setFileList(missionMapper.selectFileList(rqstNo));
        }
        return board;
    }

    @Transactional
    public void saveBoard(MissionRequest request, List<MultipartFile> files) {
        if (request.getRqstNo() == null || request.getRqstNo().isEmpty()) {
            request.setRqstNo(UUID.randomUUID().toString());

            if (request.getParentNo() != null && !request.getParentNo().isEmpty()) {
                Map<String, Object> parentParams = new HashMap<>();
                parentParams.put("rqstNo", request.getParentNo());

                MissionDto parent = missionMapper.selectBoardDetail(parentParams);
                if (parent != null) {
                    request.setGroupNo(parent.getGroupNo());
                    request.setDepth(parent.getDepth() + 1);
                    Map<String, Object> replyOrderParams = new HashMap<>();
                    replyOrderParams.put("groupNo", parent.getGroupNo());
                    replyOrderParams.put("orderNo", parent.getOrderNo());
                    missionMapper.updateReplyOrder(replyOrderParams);
                    request.setOrderNo(parent.getOrderNo() + 1);
                }
            } else {
                request.setGroupNo(request.getRqstNo());
                request.setDepth(0);
                request.setOrderNo(0);
            }

            missionMapper.insertBoard(request);
        } else {
            missionMapper.updateBoard(request);
        }

        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void updateBoard(MissionRequest request, List<MultipartFile> files) {
        missionMapper.updateBoard(request);
        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void deleteBoard(String rqstNo) {
        missionMapper.deleteComments(rqstNo);
        missionMapper.deleteFiles(rqstNo);
        missionMapper.deleteBoard(rqstNo);
    }

    public FileDto getFile(Long fileId) {
        return missionMapper.selectFile(fileId);
    }

    public List<CommentDto> getCommentList(String boardNo) {
        return missionMapper.selectCommentList(boardNo);
    }

    public void saveComment(CommentDto comment) {
        missionMapper.insertComment(comment);
    }

    public CommentDto getComment(Long commentId) {
        return missionMapper.selectCommentById(commentId.intValue());
    }

    public void handleVote(Long commentId, String action, String previousVote) {
        int id = commentId.intValue();
        if (previousVote == null) {
            if ("like".equals(action)) {
                missionMapper.increaseLike(id);
            } else {
                missionMapper.increaseDislike(id);
            }
            return;
        }

        if (previousVote.equals(action)) {
            if ("like".equals(action)) {
                missionMapper.decreaseLike(id);
            } else {
                missionMapper.decreaseDislike(id);
            }
            return;
        }

        if ("like".equals(action)) {
            missionMapper.decreaseDislike(id);
            missionMapper.increaseLike(id);
        } else {
            missionMapper.decreaseLike(id);
            missionMapper.increaseDislike(id);
        }
    }

    private void processFiles(String boardNo, List<MultipartFile> files) {
        FileUploadUtil.saveFiles(boardNo, files, uploadPath, missionMapper::insertFile);
    }
}
