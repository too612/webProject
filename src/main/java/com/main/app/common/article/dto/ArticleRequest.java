package com.main.app.common.article.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Data
public class ArticleRequest {
    private Long articleId;
    private String title;
    private String cont;
    private String rqstId;
    private String menuKey;
    private String templateCode;
    private Long parentId;
    private String password;
    private Boolean secret;
    private String metadata; // ★ Map → String으로 변경

    private Boolean isNotice;
    private String noticeStartDt;
    private String noticeEndDt;
    private Boolean isPopup;
    private String popupStartDt;
    private String popupEndDt;
    private String popupLinkUrl;
    private Long thumbnailFileId;

    // ★ 팝업 '안보기' 옵션
    private String popupDismissOption;

    // 내부용
    private String passwordHash;
    private Long groupId;
    private Integer depth;
    private Integer orderNo;

    private List<MultipartFile> files;
}