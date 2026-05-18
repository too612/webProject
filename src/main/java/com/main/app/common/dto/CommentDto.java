package com.main.app.common.dto;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

public class CommentDto {
    private Long commentId;
    private String boardNo;
    private String writer;
    private String content;
    private LocalDateTime insDt;
    private Integer likes;
    private Long parentCommentId; // 부모 댓글에 대한 부모 ID
    private List<CommentDto> replies; // 대댓글 리스트
    private int dislikes;

    // 비밀 댓글, 비밀번호, 스포일러 필드 추가
    private String secret;
    private String password;
    private String spoiler;

    public Long getCommentId() {
        return commentId;
    }

    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }

    public String getBoardNo() {
        return boardNo;
    }

    public void setBoardNo(String boardNo) {
        this.boardNo = boardNo;
    }

    public String getWriter() {
        return writer;
    }

    public void setWriter(String writer) {
        this.writer = writer;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getInsDt() {
        return insDt;
    }

    public void setInsDt(LocalDateTime insDt) {
        this.insDt = insDt;
    }

    public Integer getLikes() {
        return likes;
    }

    public void setLikes(Integer likes) {
        this.likes = likes;
    }

    public Long getParentCommentId() {
        return parentCommentId;
    }

    public void setParentCommentId(Long parentCommentId) {
        this.parentCommentId = parentCommentId;
    }

    public List<CommentDto> getReplies() {
        return replies;
    }

    public void setReplies(List<CommentDto> replies) {
        this.replies = replies;
    }

    public int getDislikes() {
        return dislikes;
    }

    public void setDislikes(int dislikes) {
        this.dislikes = dislikes;
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSpoiler() {
        return spoiler;
    }

    public void setSpoiler(String spoiler) {
        this.spoiler = spoiler;
    }

    // View에서 사용되는 경과시간 표시 메서드(예: "방금 전", "1시간 전")
    public String getTimeAgo() {
        if (insDt == null)
            return "";
        Duration duration = Duration.between(insDt, LocalDateTime.now());
        long seconds = duration.getSeconds();

        if (seconds < 60) {
            return "just now";
        } else if (seconds < 3600) {
            return (seconds / 60) + "m ago";
        } else if (seconds < 86400) {
            return (seconds / 3600) + "h ago";
        } else {
            return (seconds / 86400) + "d ago";
        }
    }
}
