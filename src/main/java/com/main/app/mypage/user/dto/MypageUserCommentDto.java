package com.main.app.mypage.user.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MypageUserCommentDto {
    private Long commentId;
    private String boardNo;
    private String boardTitle;
    private String content;
    private LocalDateTime insDt;
    private Integer likes;
    private Integer dislikes;
}
