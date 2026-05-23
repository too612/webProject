package com.main.app.official.news.bulletin.dto;

import com.main.app.common.dto.FileDto;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BulletinDto {
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
    private List<FileDto> fileList;
    private Long totalFileSize;
    private String secret;
    private String password;
    private Integer commentCount;
}
