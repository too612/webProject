package com.main.app.common.dto;

import java.time.LocalDateTime;
import java.util.List;

public class Board {
    private String rqstNo;
    private String privRqstNo;
    private String title;
    private String cont;
    private String rqstId;
    private LocalDateTime insDt;
    private LocalDateTime uptDt;
    private Integer views;

    private String boardType;

    // 답글(계층형) 게시판 필드 추가
    private String groupNo;
    private String parentNo;
    private Integer depth;
    private Integer orderNo;

    // 파일 업로드 필드 추가
    private boolean hasFile;
    private List<FileDto> fileList;

    // 비밀글 필드 추가
    private String secret;
    private String password;

    public String getRqstNo() {
        return rqstNo;
    }

    public void setRqstNo(String rqstNo) {
        this.rqstNo = rqstNo;
    }

    public String getPrivRqstNo() {
        return privRqstNo;
    }

    public void setPrivRqstNo(String privRqstNo) {
        this.privRqstNo = privRqstNo;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCont() {
        return cont;
    }

    public void setCont(String cont) {
        this.cont = cont;
    }

    public String getRqstId() {
        return rqstId;
    }

    public void setRqstId(String rqstId) {
        this.rqstId = rqstId;
    }

    public LocalDateTime getInsDt() {
        return insDt;
    }

    public void setInsDt(LocalDateTime insDt) {
        this.insDt = insDt;
    }

    public LocalDateTime getUptDt() {
        return uptDt;
    }

    public void setUptDt(LocalDateTime uptDt) {
        this.uptDt = uptDt;
    }

    public Integer getViews() {
        return views;
    }

    public void setViews(Integer views) {
        this.views = views;
    }

    public String getBoardType() {
        return boardType;
    }

    public void setBoardType(String boardType) {
        this.boardType = boardType;
    }

    public String getGroupNo() {
        return groupNo;
    }

    public void setGroupNo(String groupNo) {
        this.groupNo = groupNo;
    }

    public String getParentNo() {
        return parentNo;
    }

    public void setParentNo(String parentNo) {
        this.parentNo = parentNo;
    }

    public Integer getDepth() {
        return depth;
    }

    public void setDepth(Integer depth) {
        this.depth = depth;
    }

    public Integer getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(Integer orderNo) {
        this.orderNo = orderNo;
    }

    public boolean isHasFile() {
        return hasFile;
    }

    public void setHasFile(boolean hasFile) {
        this.hasFile = hasFile;
    }

    public List<FileDto> getFileList() {
        return fileList;
    }

    public void setFileList(List<FileDto> fileList) {
        this.fileList = fileList;
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
