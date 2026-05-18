package com.main.app.common.dto;

import java.time.LocalDateTime;

/**
 * 게시판 첨부파일 정보를 담는 DTO
 */
public class FileDto {
    private Long fileId; // 파일 ID (PK)
    private String boardNo; // 게시글 번호 (FK) - String으로 변환
    private String orgFileNm; // 원본 파일명
    private String storedFileNm; // 저장된 파일명
    private Long fileSize; // 파일 크기(바이트)
    private String filePath; // 파일 저장 경로
    private LocalDateTime insDt; // 등록일시

    public Long getFileId() {
        return fileId;
    }

    public void setFileId(Long fileId) {
        this.fileId = fileId;
    }

    public String getBoardNo() {
        return boardNo;
    }

    public void setBoardNo(String boardNo) {
        this.boardNo = boardNo;
    }

    public String getOrgFileNm() {
        return orgFileNm;
    }

    public void setOrgFileNm(String orgFileNm) {
        this.orgFileNm = orgFileNm;
    }

    public String getStoredFileNm() {
        return storedFileNm;
    }

    public void setStoredFileNm(String storedFileNm) {
        this.storedFileNm = storedFileNm;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDateTime getInsDt() {
        return insDt;
    }

    public void setInsDt(LocalDateTime insDt) {
        this.insDt = insDt;
    }
}
