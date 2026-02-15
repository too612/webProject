package com.main.app.model;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class CommentDto {
    private Long commentId;
    private String boardNo;
    private String writer;
    private String content;
    private LocalDateTime insDt;
    private Integer likes;
    private Long parentCommentId; // 대댓글을 위한 부모 댓글 ID
    private List<CommentDto> replies; // 대댓글 리스트
    private int dislikes;

    // 비밀 댓글, 비밀번호, 스포일러 필드 추가
    private String secret;
    private String password;
    private String spoiler;

    // View에서 사용할 시간 포맷 메서드 (예: "방금 전", "1시간 전")
    public String getTimeAgo() {
        if (insDt == null) return "";
        Duration duration = Duration.between(insDt, LocalDateTime.now());
        long seconds = duration.getSeconds();

        if (seconds < 60) {
            return "방금 전";
        } else if (seconds < 3600) {
            return (seconds / 60) + "분 전";
        } else if (seconds < 86400) {
            return (seconds / 3600) + "시간 전";
        } else {
            return (seconds / 86400) + "일 전";
        }
    }
}
