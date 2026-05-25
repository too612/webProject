package com.main.app.official.news.bulletin;

import com.main.app.common.dto.CommentDto;
import com.main.app.common.dto.FileDto;
import com.main.app.common.util.FileUploadUtil;
import com.main.app.common.util.PaginationUtil;
import com.main.app.official.news.bulletin.dto.BulletinDto;
import com.main.app.official.news.bulletin.dto.BulletinRequest;
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
public class BulletinService {

    private final BulletinMapper bulletinMapper;

    @Value("${spring.servlet.multipart.location:c:/upload/}")
    private String uploadPath;

    public BulletinService(BulletinMapper bulletinMapper) {
        this.bulletinMapper = bulletinMapper;
    }

    @SuppressWarnings("null")
    public Page<BulletinDto> getBoardList(Pageable pageable, String searchType, String keyword) {
        Map<String, Object> params = new HashMap<>();
        params.put("searchType", searchType);
        params.put("keyword", keyword);
        params.put("size", pageable.getPageSize());
        params.put("offset", pageable.getOffset());

        List<BulletinDto> list = bulletinMapper.selectBoardList(params);
        long total = bulletinMapper.countBoardList(params);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public BulletinDto getBoardDetail(String rqstNo, boolean increaseViewCount) {
        Map<String, Object> params = new HashMap<>();
        params.put("rqstNo", rqstNo);

        if (increaseViewCount) {
            bulletinMapper.updateReadCount(params);
        }

        BulletinDto board = bulletinMapper.selectBoardDetail(params);
        if (board != null) {
            board.setFileList(bulletinMapper.selectFileList(rqstNo));
        }
        return board;
    }

    @Transactional
    public void saveBoard(BulletinRequest request, List<MultipartFile> files) {
        if (request.getRqstNo() == null || request.getRqstNo().isEmpty()) {
            request.setRqstNo(UUID.randomUUID().toString());

            if (request.getParentNo() != null && !request.getParentNo().isEmpty()) {
                Map<String, Object> parentParams = new HashMap<>();
                parentParams.put("rqstNo", request.getParentNo());

                BulletinDto parent = bulletinMapper.selectBoardDetail(parentParams);
                if (parent != null) {
                    request.setGroupNo(parent.getGroupNo());
                    request.setDepth(parent.getDepth() + 1);
                    Map<String, Object> replyOrderParams = new HashMap<>();
                    replyOrderParams.put("groupNo", parent.getGroupNo());
                    replyOrderParams.put("orderNo", parent.getOrderNo());
                    bulletinMapper.updateReplyOrder(replyOrderParams);
                    request.setOrderNo(parent.getOrderNo() + 1);
                }
            } else {
                request.setGroupNo(request.getRqstNo());
                request.setDepth(0);
                request.setOrderNo(0);
            }

            bulletinMapper.insertBoard(request);
        } else {
            bulletinMapper.updateBoard(request);
        }

        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void updateBoard(BulletinRequest request, List<MultipartFile> files) {
        bulletinMapper.updateBoard(request);
        processFiles(request.getRqstNo(), files);
    }

    @Transactional
    public void deleteBoard(String rqstNo) {
        bulletinMapper.deleteComments(rqstNo);
        bulletinMapper.deleteFiles(rqstNo);
        bulletinMapper.deleteBoard(rqstNo);
    }

    public FileDto getFile(Long fileId) {
        return bulletinMapper.selectFile(fileId);
    }

    public List<CommentDto> getCommentList(String boardNo) {
        return bulletinMapper.selectCommentList(boardNo);
    }

    public void saveComment(CommentDto comment) {
        bulletinMapper.insertComment(comment);
    }

    public CommentDto getComment(Long commentId) {
        return bulletinMapper.selectCommentById(commentId.intValue());
    }

    public void handleVote(Long commentId, String action, String previousVote) {
        int id = commentId.intValue();
        if (previousVote == null) {
            if ("like".equals(action)) {
                bulletinMapper.increaseLike(id);
            } else {
                bulletinMapper.increaseDislike(id);
            }
            return;
        }

        if (previousVote.equals(action)) {
            if ("like".equals(action)) {
                bulletinMapper.decreaseLike(id);
            } else {
                bulletinMapper.decreaseDislike(id);
            }
            return;
        }

        if ("like".equals(action)) {
            bulletinMapper.decreaseDislike(id);
            bulletinMapper.increaseLike(id);
        } else {
            bulletinMapper.decreaseLike(id);
            bulletinMapper.increaseDislike(id);
        }
    }

    private void processFiles(String boardNo, List<MultipartFile> files) {
        FileUploadUtil.saveFiles(boardNo, files, uploadPath, bulletinMapper::insertFile);
    }
}
