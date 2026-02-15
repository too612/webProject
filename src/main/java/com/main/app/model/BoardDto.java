package com.main.app.model;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class BoardDto {
    private String rqstNo;      // 게시글 번호 (PK) - String으로 변경
    private String title;       // 제목
    private String cont;        // 내용
    private String rqstId;      // 작성자 ID
    private LocalDateTime insDt;// 등록일
    private LocalDateTime uptDt;// 수정일
    private Integer views;      // 조회수
    
    // 계층형 게시판 필드
    private String groupNo;     // 그룹 번호 (원글 번호) - String으로 변경
    private String parentNo;    // 부모글 번호 - String으로 변경
    private Integer depth;      // 들여쓰기 레벨 (0: 원글, 1: 답글...)
    private Integer orderNo;    // 그룹 내 정렬 순서
    
    // 파일 관련 필드
    private boolean hasFile;    // 파일 첨부 여부 (목록 표시용)
    private List<FileDto> fileList; // 첨부파일 목록 (상세 보기용)
    private Long totalFileSize; // 첨부파일 총 크기 (목록 표시용)

    private String secret;
    private String password;

    // 댓글 개수 (목록 표시용)
    private Integer commentCount;
}