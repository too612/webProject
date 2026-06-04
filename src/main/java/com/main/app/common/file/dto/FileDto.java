package com.main.app.common.file.dto;

import java.time.LocalDateTime;

/**
 * 공통 첨부파일 DTO
 */
public class FileDto {
    private Long fileId;
    private String boardNo;
    private String orgFileNm;
    private String storedFileNm;
    private Long fileSize;
    private String filePath;
    private String fileCategory;
    private String menuKey;
    private String pathYear;
    private String pathMmdd;
    private String relativeDir;
    private String relativePath;
    private String fileExt;
    private String mimeType;
    private String uploaderId;
    private String uploaderIp;
    private Boolean isDeleted;
    private LocalDateTime insDt;
    private LocalDateTime delDt;

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

    public String getFileCategory() {
        return fileCategory;
    }

    public void setFileCategory(String fileCategory) {
        this.fileCategory = fileCategory;
    }

    public String getMenuKey() {
        return menuKey;
    }

    public void setMenuKey(String menuKey) {
        this.menuKey = menuKey;
    }

    public String getPathYear() {
        return pathYear;
    }

    public void setPathYear(String pathYear) {
        this.pathYear = pathYear;
    }

    public String getPathMmdd() {
        return pathMmdd;
    }

    public void setPathMmdd(String pathMmdd) {
        this.pathMmdd = pathMmdd;
    }

    public String getRelativeDir() {
        return relativeDir;
    }

    public void setRelativeDir(String relativeDir) {
        this.relativeDir = relativeDir;
    }

    public String getRelativePath() {
        return relativePath;
    }

    public void setRelativePath(String relativePath) {
        this.relativePath = relativePath;
    }

    public String getFileExt() {
        return fileExt;
    }

    public void setFileExt(String fileExt) {
        this.fileExt = fileExt;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getUploaderId() {
        return uploaderId;
    }

    public void setUploaderId(String uploaderId) {
        this.uploaderId = uploaderId;
    }

    public String getUploaderIp() {
        return uploaderIp;
    }

    public void setUploaderIp(String uploaderIp) {
        this.uploaderIp = uploaderIp;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public LocalDateTime getInsDt() {
        return insDt;
    }

    public void setInsDt(LocalDateTime insDt) {
        this.insDt = insDt;
    }

    public LocalDateTime getDelDt() {
        return delDt;
    }

    public void setDelDt(LocalDateTime delDt) {
        this.delDt = delDt;
    }
}
