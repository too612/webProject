package com.main.app.model;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import com.main.app.model.FileDto; // 명시적 import 추가

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
