package com.main.app.common.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class Board {
    private String rqstNo;
    private String privRqstNo;
    private String title;
    private String cont;
    private String rqstId;
    private LocalDateTime insDt;
    private LocalDateTime uptDt;
    private Integer views;

    private String boardType;

    // 계층형 게시판 필드 추가
    private String groupNo;
    private String parentNo;
    private Integer depth;
    private Integer orderNo;

    // 파일 관련 필드 추가
    private boolean hasFile;
    private List<FileDto> fileList;

    // 비밀글 관련 필드 추가
    private String secret;
    private String password;
}
