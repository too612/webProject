package com.main.app.common.comment;

import com.main.app.common.comment.dto.CommentDto;
import com.main.app.common.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/common/comment")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public ApiResponse<List<CommentDto>> getList(
            @RequestParam("pgmId") String pgmId,
            @RequestParam("refId") String refId) {
        return ApiResponse.ok(commentService.getCommentList(pgmId, refId));
    }

    @PostMapping("/save")
    public ApiResponse<Void> save(@RequestBody CommentDto comment, HttpServletRequest request) {
        comment.setInsId(comment.getWriter()); // 실무에서는 세션 사용자 ID 사용 권장
        comment.setInsIp(request.getRemoteAddr());
        commentService.saveComment(comment);
        return ApiResponse.ok(null, "댓글이 등록되었습니다.");
    }

    @PostMapping("/vote")
    public ApiResponse<Map<String, Object>> vote(
            @RequestBody Map<String, String> payload,
            HttpSession session) {
        Long commentId = Long.parseLong(payload.get("commentId"));
        String action = payload.get("action");

        Map<Long, String> voteHistory = (Map<Long, String>) session.getAttribute("commentVoteHistory");
        if (voteHistory == null) {
            voteHistory = new HashMap<>();
            session.setAttribute("commentVoteHistory", voteHistory);
        }

        String previousVote = voteHistory.get(commentId);
        commentService.handleVote(commentId, action, previousVote);

        if (action.equals(previousVote)) {
            voteHistory.remove(commentId);
        } else {
            voteHistory.put(commentId, action);
        }

        CommentDto updated = commentService.getComment(commentId);
        Map<String, Object> response = new HashMap<>();
        response.put("likes", updated.getLikes());
        response.put("dislikes", updated.getDislikes());
        response.put("userVote", voteHistory.get(commentId));

        return ApiResponse.ok(response);
    }

    @PostMapping("/delete/{id}")
    public ApiResponse<Void> delete(@PathVariable("id") Long id, @RequestParam("updId") String updId,
            HttpServletRequest request) {
        commentService.deleteComment(id, updId, request.getRemoteAddr());
        return ApiResponse.ok(null, "댓글이 삭제되었습니다.");
    }

    /**
     * 비밀댓글 비밀번호 확인
     * POST /api/common/comment/check-password
     */
    @PostMapping("/check-password")
    public ApiResponse<Boolean> checkPassword(@RequestBody Map<String, String> payload) {
        Long commentId = Long.parseLong(payload.get("commentId"));
        String password = payload.get("password");
        boolean valid = commentService.isValidPassword(commentId, password);
        return ApiResponse.ok(valid);
    }
}