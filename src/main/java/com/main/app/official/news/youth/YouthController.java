package com.main.app.official.news.youth;

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
import com.main.app.common.attachment.dto.AttachmentDto;
import com.main.app.official.news.youth.dto.YouthDto;
import com.main.app.official.news.youth.dto.YouthRequest;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/official/news/youth")
public class YouthController {

    private static final String BASE_PATH = "/news/youth";

    private final YouthService youthService;

    public YouthController(YouthService youthService) {
        this.youthService = youthService;
    }

    @GetMapping
    public ApiResponse<Page<YouthDto>> list(@RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "searchType", required = false) String searchType,
            @RequestParam(name = "keyword", required = false) String keyword) {
        return ApiResponse.ok(youthService.getBoardList(PageRequest.of(page, 10), searchType, keyword));
    }

    @GetMapping("/write")
    public ApiResponse<YouthDto> writeForm(@RequestParam(name = "rqstNo", required = false) String rqstNo) {
        if (rqstNo != null) return ApiResponse.ok(youthService.getBoardDetail(rqstNo, false));
        YouthDto board = new YouthDto(); board.setBoardType("YOUTH"); return ApiResponse.ok(board);
    }

    @GetMapping("/reply")
    public ApiResponse<YouthDto> replyForm(@RequestParam(name = "parentNo") String parentNo) {
        YouthDto parent = youthService.getBoardDetail(parentNo, false);
        YouthDto reply = new YouthDto(); reply.setParentNo(parentNo); reply.setTitle("RE: " + parent.getTitle()); reply.setBoardType("YOUTH"); return ApiResponse.ok(reply);
    }

    @PostMapping("/write")
    public ApiResponse<Map<String, String>> save(YouthRequest request, @RequestParam(name = "files", required = false) List<MultipartFile> files) {
        if (request.getOrderNo() == null) request.setOrderNo(0);
        if (request.getDepth() == null) request.setDepth(0);
        youthService.saveBoard(request, files);
        Map<String, String> p = new HashMap<>(); p.put("basePath", BASE_PATH); return ApiResponse.ok(p, "게시글이 등록되었습니다.");
    }

    @PostMapping("/update")
    public ApiResponse<Map<String, String>> update(YouthRequest request, @RequestParam(name = "files", required = false) List<MultipartFile> files) {
        youthService.updateBoard(request, files);
        Map<String, String> p = new HashMap<>(); p.put("rqstNo", request.getRqstNo()); return ApiResponse.ok(p, "게시글이 수정되었습니다.");
    }

    @PostMapping("/delete")
    public ApiResponse<Map<String, String>> delete(@RequestParam(name = "rqstNo") String rqstNo) {
        youthService.deleteBoard(rqstNo);
        Map<String, String> p = new HashMap<>(); p.put("rqstNo", rqstNo); return ApiResponse.ok(p, "게시글이 삭제되었습니다.");
    }

    @GetMapping("/view")
    public ApiResponse<Map<String, Object>> view(@RequestParam(name = "rqstNo") String rqstNo, HttpSession session) {
        YouthDto board = youthService.getBoardDetail(rqstNo, true);
        List<CommentDto> comments = youthService.getCommentList(rqstNo);
        @SuppressWarnings("unchecked")
        Map<Long, String> vh = (Map<Long, String>) session.getAttribute("voteHistory");
        if (vh == null) vh = new HashMap<>();
        Map<String, Object> p = new HashMap<>(); p.put("board", board); p.put("comments", comments); p.put("commentCount", comments.size()); p.put("userVotes", vh);
        return ApiResponse.ok(p);
    }

    @PostMapping("/view")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkPasswordAndView(@RequestParam(name = "rqstNo") String rqstNo, @RequestParam(name = "password") String password) {
        YouthDto board = youthService.getBoardDetail(rqstNo, false);
        if (board == null || !password.equals(board.getPassword())) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "비밀번호가 일치하지 않습니다."));
        List<CommentDto> comments = youthService.getCommentList(rqstNo);
        Map<String, Object> p = new HashMap<>(); p.put("board", board); p.put("comments", comments); p.put("commentCount", comments.size());
        return ResponseEntity.ok(ApiResponse.ok(p));
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> download(@RequestParam("fileId") Long fileId) throws MalformedURLException {
        AttachmentDto file = youthService.getFile(fileId);
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + URLEncoder.encode(Objects.requireNonNullElse(file.getOrgFileNm(), "download"), StandardCharsets.UTF_8) + "\"").body(new UrlResource("file:" + file.getFilePath()));
    }

    @PostMapping("/comment/write")
    public ApiResponse<Map<String, Object>> writeComment(CommentDto comment) {
        youthService.saveComment(comment);
        Map<String, Object> p = new HashMap<>(); p.put("boardNo", comment.getBoardNo()); return ApiResponse.ok(p, "댓글이 등록되었습니다.");
    }

    @PostMapping("/comment/vote")
    public ApiResponse<Map<String, Object>> likeComment(@RequestBody Map<String, String> payload, HttpSession session) {
        Long commentId = Long.parseLong(payload.get("commentId")); String action = payload.get("action");
        @SuppressWarnings("unchecked")
        Map<Long, String> vh = (Map<Long, String>) session.getAttribute("voteHistory");
        if (vh == null) { vh = new HashMap<>(); session.setAttribute("voteHistory", vh); }
        String prev = vh.get(commentId); youthService.handleVote(commentId, action, prev);
        if (action.equals(prev)) vh.remove(commentId); else vh.put(commentId, action);
        CommentDto uc = youthService.getComment(commentId);
        Map<String, Object> r = new HashMap<>(); r.put("likes", uc.getLikes()); r.put("dislikes", uc.getDislikes()); r.put("userVote", vh.get(commentId));
        return ApiResponse.ok(r);
    }
}