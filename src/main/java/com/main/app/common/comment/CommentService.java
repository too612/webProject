package com.main.app.common.comment;

import com.main.app.common.comment.dto.CommentDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentMapper commentMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<CommentDto> getCommentList(String pgmId, String refId) {
        return commentMapper.selectCommentList(pgmId, refId);
    }

    // ★ 추가된 메서드 (countComments)
    @Transactional(readOnly = true)
    public int countComments(String pgmId, String refId) {
        Integer count = commentMapper.countComments(pgmId, refId);
        return count != null ? count : 0;
    }

    @Transactional
    public void saveComment(CommentDto comment) {
        if (StringUtils.hasText(comment.getPassword())) {
            comment.setPassword(passwordEncoder.encode(comment.getPassword()));
        }
        commentMapper.insertComment(comment);
    }

    @Transactional(readOnly = true)
    public CommentDto getComment(Long commentId) {
        return commentMapper.selectCommentById(commentId);
    }

    @Transactional
    public void handleVote(Long commentId, String action, String previousVote) {
        if (previousVote == null) {
            commentMapper.updateVote(commentId, action, 1);
            return;
        }
        if (previousVote.equals(action)) {
            commentMapper.updateVote(commentId, action, -1);
            return;
        }
        String reverseAction = action.equals("like") ? "dislike" : "like";
        commentMapper.updateVote(commentId, reverseAction, -1);
        commentMapper.updateVote(commentId, action, 1);
    }

    @Transactional
    public void deleteComment(Long commentId, String updId, String updIp) {
        commentMapper.softDeleteComment(commentId, updId, updIp);
    }

    @Transactional
    public void softDeleteCommentsByRef(String pgmId, String refId) {
        commentMapper.softDeleteCommentsByRef(pgmId, refId);
    }

    public boolean isValidPassword(Long commentId, String rawPassword) {
        CommentDto comment = commentMapper.selectCommentById(commentId);
        if (comment == null || !StringUtils.hasText(comment.getPassword()))
            return false;
        return passwordEncoder.matches(rawPassword, comment.getPassword());
    }
}