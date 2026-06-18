package com.main.app.official.worship.sermons.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.main.app.common.attachment.dto.AttachmentDto;

import lombok.Data;

@Data
public class SermonDto {

    private String rqstNo;
    private String title;
    private String cont;
    private String rqstId;
    private String preacherName;
    private String scriptureReference;
    private LocalDate sermonDate;
    private String worshipType;
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
