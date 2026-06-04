package com.main.app.official.news.bulletin;

import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.CommentDto;
import com.main.app.common.file.dto.FileDto;
import com.main.app.official.news.bulletin.dto.BulletinDto;
import com.main.app.official.news.bulletin.dto.BulletinRequest;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/official/news/bulletin")
public class BulletinController {

    private static final String BASE_PATH = "/news/bulletin";

    private final BulletinService bulletinService;

    public BulletinController(BulletinService bulletinService) {
        this.bulletinService = bulletinService;
    }

    @GetMapping
    public ApiResponse<Page<BulletinDto>> list(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "searchType", required = false) String searchType,
            @RequestParam(name = "keyword", required = false) String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        Page<BulletinDto> paging = bulletinService.getBoardList(pageable, searchType, keyword);
        return ApiResponse.ok(paging);
    }

    @GetMapping("/write")
    public ApiResponse<BulletinDto> writeForm(@RequestParam(name = "rqstNo", required = false) String rqstNo) {
        if (rqstNo != null) {
            BulletinDto board = bulletinService.getBoardDetail(rqstNo, false);
            return ApiResponse.ok(board);
        }

        BulletinDto board = new BulletinDto();
        board.setBoardType("BULLETIN");
        return ApiResponse.ok(board);
    }

    @GetMapping("/reply")
    public ApiResponse<BulletinDto> replyForm(@RequestParam(name = "parentNo") String parentNo) {
        BulletinDto parent = bulletinService.getBoardDetail(parentNo, false);
        BulletinDto reply = new BulletinDto();
        reply.setParentNo(parentNo);
        reply.setTitle("RE: " + parent.getTitle());
        reply.setBoardType("BULLETIN");
        return ApiResponse.ok(reply);
    }

    @PostMapping("/write")
    public ApiResponse<Map<String, String>> save(BulletinRequest request,
            @RequestParam(name = "files", required = false) List<MultipartFile> files) {
        if (request.getOrderNo() == null) {
            request.setOrderNo(0);
        }
        if (request.getDepth() == null) {
            request.setDepth(0);
        }
        bulletinService.saveBoard(request, files);

        Map<String, String> payload = new HashMap<>();
        payload.put("basePath", BASE_PATH);
        return ApiResponse.ok(payload, "게시글이 등록되었습니다.");
    }

    @PostMapping("/update")
    public ApiResponse<Map<String, String>> update(BulletinRequest request,
            @RequestParam(name = "files", required = false) List<MultipartFile> files) {
        bulletinService.updateBoard(request, files);

        Map<String, String> payload = new HashMap<>();
        payload.put("rqstNo", request.getRqstNo());
        return ApiResponse.ok(payload, "게시글이 수정되었습니다.");
    }

    @PostMapping("/delete")
    public ApiResponse<Map<String, String>> delete(@RequestParam(name = "rqstNo") String rqstNo) {
        bulletinService.deleteBoard(rqstNo);

        Map<String, String> payload = new HashMap<>();
        payload.put("rqstNo", rqstNo);
        return ApiResponse.ok(payload, "게시글이 삭제되었습니다.");
    }

    @GetMapping("/view")
    public ApiResponse<Map<String, Object>> view(
            @RequestParam(name = "rqstNo") String rqstNo,
            HttpSession session) {
        BulletinDto board = bulletinService.getBoardDetail(rqstNo, true);
        List<CommentDto> comments = bulletinService.getCommentList(rqstNo);

        @SuppressWarnings("unchecked")
        Map<Long, String> voteHistory = (Map<Long, String>) session.getAttribute("voteHistory");
        if (voteHistory == null) {
            voteHistory = new HashMap<>();
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("board", board);
        payload.put("comments", comments);
        payload.put("commentCount", comments.size());
        payload.put("userVotes", voteHistory);
        return ApiResponse.ok(payload);
    }

    @PostMapping("/view")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkPasswordAndView(
            @RequestParam(name = "rqstNo") String rqstNo,
            @RequestParam(name = "password") String password) {
        BulletinDto board = bulletinService.getBoardDetail(rqstNo, false);
        if (board == null || !password.equals(board.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "비밀번호가 일치하지 않습니다."));
        }

        List<CommentDto> comments = bulletinService.getCommentList(rqstNo);
        Map<String, Object> payload = new HashMap<>();
        payload.put("board", board);
        payload.put("comments", comments);
        payload.put("commentCount", comments.size());
        return ResponseEntity.ok(ApiResponse.ok(payload));
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> download(@RequestParam("fileId") Long fileId) throws MalformedURLException {
        FileDto file = bulletinService.getFile(fileId);
        UrlResource resource = new UrlResource("file:" + file.getFilePath());
        String originalFileName = Objects.requireNonNullElse(file.getOrgFileNm(), "download");
        String encodedUploadFileName = URLEncoder.encode(originalFileName, StandardCharsets.UTF_8);
        String contentDisposition = "attachment; filename=\"" + encodedUploadFileName + "\"";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(resource);
    }

    @PostMapping("/comment/write")
    public ApiResponse<Map<String, Object>> writeComment(CommentDto comment) {
        bulletinService.saveComment(comment);

        Map<String, Object> payload = new HashMap<>();
        payload.put("boardNo", comment.getBoardNo());
        return ApiResponse.ok(payload, "댓글이 등록되었습니다.");
    }

    @PostMapping("/comment/vote")
    public ApiResponse<Map<String, Object>> likeComment(
            @RequestBody Map<String, String> payload,
            HttpSession session) {
        Long commentId = Long.parseLong(payload.get("commentId"));
        String action = payload.get("action");

        @SuppressWarnings("unchecked")
        Map<Long, String> voteHistory = (Map<Long, String>) session.getAttribute("voteHistory");
        if (voteHistory == null) {
            voteHistory = new HashMap<>();
            session.setAttribute("voteHistory", voteHistory);
        }

        String previousVote = voteHistory.get(commentId);
        bulletinService.handleVote(commentId, action, previousVote);

        if (action.equals(previousVote)) {
            voteHistory.remove(commentId);
        } else {
            voteHistory.put(commentId, action);
        }

        CommentDto updatedComment = bulletinService.getComment(commentId);
        Map<String, Object> response = new HashMap<>();
        response.put("likes", updatedComment.getLikes());
        response.put("dislikes", updatedComment.getDislikes());
        response.put("userVote", voteHistory.get(commentId));

        return ApiResponse.ok(response);
    }
}

