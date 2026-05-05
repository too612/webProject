package com.main.app.common.controller;

import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import org.springframework.http.HttpStatus;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.BoardDto;
import com.main.app.common.dto.CommentDto;
import com.main.app.common.dto.FileDto;
import com.main.app.common.helper.BoardContext;
import com.main.app.common.service.BoardService;

import jakarta.servlet.http.HttpSession;

public abstract class AbstractBoardController {

    @Autowired
    protected BoardService boardService;

    protected abstract BoardContext getBoardContext();

    @GetMapping
    @ResponseBody
    public ApiResponse<Page<BoardDto>> list(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "searchType", required = false) String searchType,
            @RequestParam(name = "keyword", required = false) String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        Page<BoardDto> paging = boardService.getBoardList(pageable, searchType, keyword, getBoardContext().getBoardType());
        return ApiResponse.ok(paging);
    }

    @GetMapping("/write")
    @ResponseBody
    public ApiResponse<BoardDto> writeForm(@RequestParam(name = "rqstNo", required = false) String rqstNo) {
        if (rqstNo != null) {
            BoardDto board = boardService.getBoardDetail(rqstNo, getBoardContext().getBoardType());
            return ApiResponse.ok(board);
        } else {
            BoardDto board = new BoardDto();
            board.setBoardType(getBoardContext().getBoardType());
            return ApiResponse.ok(board);
        }
    }

    @GetMapping("/reply")
    @ResponseBody
    public ApiResponse<BoardDto> replyForm(@RequestParam(name = "parentNo") String parentNo) {
        BoardDto parent = boardService.getBoardDetail(parentNo, getBoardContext().getBoardType());
        BoardDto reply = new BoardDto();
        reply.setParentNo(parentNo);
        reply.setTitle("RE: " + parent.getTitle());
        reply.setBoardType(getBoardContext().getBoardType());
        return ApiResponse.ok(reply);
    }

    @PostMapping("/write")
    @ResponseBody
    public ApiResponse<Map<String, String>> save(BoardDto board,
            @RequestParam(name = "files", required = false) List<MultipartFile> files) {
        if (board.getOrderNo() == null) board.setOrderNo(0);
        if (board.getDepth() == null) board.setDepth(0);
        board.setBoardType(getBoardContext().getBoardType());
        boardService.saveBoard(board, files);
        Map<String, String> payload = new HashMap<>();
        payload.put("basePath", getBoardContext().getBasePath());
        return ApiResponse.ok(payload, "게시글이 등록되었습니다.");
    }

    @PostMapping("/update")
    @ResponseBody
    public ApiResponse<Map<String, String>> update(BoardDto board,
            @RequestParam(name = "files", required = false) List<MultipartFile> files) {
        board.setBoardType(getBoardContext().getBoardType());
        boardService.updateBoard(board, files);
        Map<String, String> payload = new HashMap<>();
        payload.put("rqstNo", board.getRqstNo());
        return ApiResponse.ok(payload, "게시글이 수정되었습니다.");
    }

    @PostMapping("/delete")
    @ResponseBody
    public ApiResponse<Map<String, String>> delete(@RequestParam(name = "rqstNo") String rqstNo) {
        boardService.deleteBoard(rqstNo);
        Map<String, String> payload = new HashMap<>();
        payload.put("rqstNo", rqstNo);
        return ApiResponse.ok(payload, "게시글이 삭제되었습니다.");
    }

    @GetMapping("/view")
    @ResponseBody
    public ApiResponse<Map<String, Object>> view(@RequestParam(name = "rqstNo") String rqstNo, HttpSession session) {
        BoardDto board = boardService.getBoardDetail(rqstNo, getBoardContext().getBoardType());
        List<CommentDto> comments = boardService.getCommentList(rqstNo);

        @SuppressWarnings("unchecked")
        Map<Long, String> voteHistory = (Map<Long, String>) session.getAttribute("voteHistory");
        if (voteHistory == null) voteHistory = new HashMap<>();

        Map<String, Object> payload = new HashMap<>();
        payload.put("board", board);
        payload.put("comments", comments);
        payload.put("commentCount", comments.size());
        payload.put("userVotes", voteHistory);
        return ApiResponse.ok(payload);
    }

    @PostMapping("/view")
    @ResponseBody
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkPasswordAndView(
            @RequestParam(name = "rqstNo") String rqstNo,
            @RequestParam(name = "password") String password) {
        BoardDto board = boardService.getBoardDetail(rqstNo, getBoardContext().getBoardType());
        if (board == null || !password.equals(board.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), "비밀번호가 일치하지 않습니다."));
        }
        List<CommentDto> comments = boardService.getCommentList(rqstNo);
        Map<String, Object> payload = new HashMap<>();
        payload.put("board", board);
        payload.put("comments", comments);
        payload.put("commentCount", comments.size());
        return ResponseEntity.ok(ApiResponse.ok(payload));
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> download(@RequestParam("fileId") Long fileId) throws MalformedURLException {
        FileDto file = boardService.getFile(fileId);
        UrlResource resource = new UrlResource("file:" + file.getFilePath());
        String originalFileName = Objects.requireNonNullElse(file.getOrgFileNm(), "download");
        String encodedUploadFileName = UriUtils.encode(originalFileName, StandardCharsets.UTF_8);
        String contentDisposition = "attachment; filename=\"" + encodedUploadFileName + "\"";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(resource);
    }

    @PostMapping("/comment/write")
    @ResponseBody
    public ApiResponse<Map<String, Object>> writeComment(CommentDto comment) {
        boardService.saveComment(comment);
        Map<String, Object> payload = new HashMap<>();
        payload.put("boardNo", comment.getBoardNo());
        return ApiResponse.ok(payload, "댓글이 등록되었습니다.");
    }

    @PostMapping("/comment/vote")
    @ResponseBody
    public ApiResponse<Map<String, Object>> likeComment(@RequestBody Map<String, String> payload, HttpSession session) {
        Long commentId = Long.parseLong(payload.get("commentId"));
        String action = payload.get("action");

        @SuppressWarnings("unchecked")
        Map<Long, String> voteHistory = (Map<Long, String>) session.getAttribute("voteHistory");
        if (voteHistory == null) {
            voteHistory = new HashMap<>();
            session.setAttribute("voteHistory", voteHistory);
        }

        String previousVote = voteHistory.get(commentId);
        boardService.handleVote(commentId, action, previousVote);

        if (action.equals(previousVote)) {
            voteHistory.remove(commentId);
        } else {
            voteHistory.put(commentId, action);
        }

        CommentDto updatedComment = boardService.getComment(commentId);
        Map<String, Object> response = new HashMap<>();
        response.put("likes", updatedComment.getLikes());
        response.put("dislikes", updatedComment.getDislikes());
        response.put("userVote", voteHistory.get(commentId));

        return ApiResponse.ok(response);
    }
}
