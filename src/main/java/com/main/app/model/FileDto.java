package com.main.app.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FileDto {
    private Long fileId;
    private String boardNo;     // 게시글 번호 (FK) - String으로 변경
    private String orgFileNm;   // 원본 파일명
    private String storedFileNm;// 저장된 파일명
    private Long fileSize;
    private String filePath;
    private LocalDateTime insDt;
}