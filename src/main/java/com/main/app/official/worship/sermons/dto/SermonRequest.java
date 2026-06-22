package com.main.app.official.worship.sermons.dto;

import lombok.Data;

@Data
public class SermonRequest {
    private Long rqstNo;
    private String title;
    private String cont;
    private String rqstId;
    private Long parentNo;
    private String password;
    private String secret;

    // 설교 전용 필드
    private String preacherName;
    private String scriptureReference;
    private String worshipType;
    private String sermonDate;

    // 공지/팝업/갤러리 확장 필드
    private Boolean isNotice;
    private String noticeStartDt;
    private String noticeEndDt;
    private Boolean isPopup;
    private String popupStartDt;
    private String popupEndDt;
    private String popupLinkUrl;
    private Long thumbnailFileId;
    private String popupDismissOption;

    // 답글용 (SermonService에서 사용)
    private Long groupNo;
    private Integer depth;
    private Integer orderNo;
}