package com.main.app.common.article.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import com.main.app.common.attachment.dto.AttachmentDto;

@Data
public class ArticleDto {
    private Long articleId;
    private String articleUuid;
    private String title;
    private String contentHtml;
    private String contentText;
    private String authorId;
    private String menuKey;
    private String templateCode;
    private Long parentId;
    private Long groupId;
    private Integer depth;
    private Integer orderNo;
    private Boolean isSecret;
    private String passwordHash;
    private Integer viewCount;
    private String status;
    private String metadata; // ★ Map → String으로 변경
    private String summaryText;
    private String keywordsJson;
    private String aiLanguageCode;
    private Boolean aiReady;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Boolean isNotice;
    private LocalDateTime noticeStartDt;
    private LocalDateTime noticeEndDt;
    private Boolean isPopup;
    private LocalDateTime popupStartDt;
    private LocalDateTime popupEndDt;
    private String popupLinkUrl;
    private Long thumbnailFileId;

    private Integer fileCount;
    private List<AttachmentDto> fileList;
    private Integer commentCount;
    private Long firstFileId;

    // ★ 팝업 '안보기' 옵션
    private String popupDismissOption;
}