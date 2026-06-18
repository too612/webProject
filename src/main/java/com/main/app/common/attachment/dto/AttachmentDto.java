package com.main.app.common.attachment.dto;

import lombok.Data;

@Data
public class AttachmentDto {
    private Long fileId;
    private String pgmId;
    private String refId;
    private String orgFileNm;
    private String storedFileNm;
    private String filePath;
    private String relativePath;
    private String fileExt;
    private String mimeType;
    private Long fileSize;
    private Integer sortOrder;
    private String description;
    private String uploaderId;
    private String uploaderIp;
    private Boolean isDeleted;
    private String delDt;
    private String insDt;
    private String insId;
    private String updDt;
    private String updId;

    /**
     * 파일 용도 구분
     * - 'editor': 본문(Editor)에 삽입된 이미지
     * - 'attachment': 첨부파일 영역에 등록된 파일 (기본값)
     */
    private String fileUsage;
}