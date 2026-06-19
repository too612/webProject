package com.main.app.official.support.announcement.dto;

import com.main.app.common.attachment.dto.AttachmentDto;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AnnouncementDto {
    private String rqstNo;
    private String title;
    private String cont;
    private String rqstId;
    private LocalDateTime insDt;
    private LocalDateTime uptDt;
    private Integer views;
    private String boardType;
    private String groupNo;
    private String parentNo;
    private Integer depth;
    private Integer orderNo;
    private boolean hasFile;
    private List<AttachmentDto> fileList;
    private Long totalFileSize;
    private String secret;
    private String password;
    private Integer commentCount;
}