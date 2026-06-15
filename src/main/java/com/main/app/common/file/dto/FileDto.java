package com.main.app.common.file.dto;

import java.time.LocalDateTime;

/**
 * 공통 첨부파일 DTO — com_file 테이블 대응
 */
public class FileDto {

    private Long fileId;
    private String pgmId;           // 프로그램 구분 (sermon, pastor, qna ...)
    private String refId;           // 참조 ID (게시글 번호, 신청번호 등)
    private String orgFileNm;       // 원본 파일명
    private String storedFileNm;    // 저장 파일명 (UUID + 원본명)
    private String filePath;        // 물리 절대경로
    private String relativePath;    // 상대경로
    private String fileExt;         // 확장자
    private String mimeType;        // MIME 타입
    private Long fileSize;          // 파일 크기 (bytes)
    private Integer sortOrder;      // 정렬 순서
    private String description;     // 파일 설명 (AI 검색/요약용)
    private String uploaderId;      // 업로더 ID
    private String uploaderIp;      // 업로더 IP
    private Boolean isDeleted;
    private LocalDateTime delDt;
    private LocalDateTime insDt;
    private String insId;
    private LocalDateTime updDt;
    private String updId;

    public Long getFileId() { return fileId; }
    public void setFileId(Long fileId) { this.fileId = fileId; }

    public String getPgmId() { return pgmId; }
    public void setPgmId(String pgmId) { this.pgmId = pgmId; }

    public String getRefId() { return refId; }
    public void setRefId(String refId) { this.refId = refId; }

    public String getOrgFileNm() { return orgFileNm; }
    public void setOrgFileNm(String orgFileNm) { this.orgFileNm = orgFileNm; }

    public String getStoredFileNm() { return storedFileNm; }
    public void setStoredFileNm(String storedFileNm) { this.storedFileNm = storedFileNm; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getRelativePath() { return relativePath; }
    public void setRelativePath(String relativePath) { this.relativePath = relativePath; }

    public String getFileExt() { return fileExt; }
    public void setFileExt(String fileExt) { this.fileExt = fileExt; }

    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUploaderId() { return uploaderId; }
    public void setUploaderId(String uploaderId) { this.uploaderId = uploaderId; }

    public String getUploaderIp() { return uploaderIp; }
    public void setUploaderIp(String uploaderIp) { this.uploaderIp = uploaderIp; }

    public Boolean getIsDeleted() { return isDeleted; }
    public void setIsDeleted(Boolean isDeleted) { this.isDeleted = isDeleted; }

    public LocalDateTime getDelDt() { return delDt; }
    public void setDelDt(LocalDateTime delDt) { this.delDt = delDt; }

    public LocalDateTime getInsDt() { return insDt; }
    public void setInsDt(LocalDateTime insDt) { this.insDt = insDt; }

    public String getInsId() { return insId; }
    public void setInsId(String insId) { this.insId = insId; }

    public LocalDateTime getUpdDt() { return updDt; }
    public void setUpdDt(LocalDateTime updDt) { this.updDt = updDt; }

    public String getUpdId() { return updId; }
    public void setUpdId(String updId) { this.updId = updId; }
}
