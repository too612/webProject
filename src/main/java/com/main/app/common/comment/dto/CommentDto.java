package com.main.app.common.comment.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class CommentDto {
    private Long commentId;
    private String pgmId;
    private String refId;
    private Long parentCommentId;
    private String writer;
    private String content;
    private String secret;
    private String password;
    private String spoiler;
    private Integer likes;
    private Integer dislikes;
    private Boolean isDeleted;
    private LocalDateTime insDt;
    private String insId;
    private String insIp;

    private List<CommentDto> replies;
}