package com.main.app.common.dto;

import java.time.LocalDateTime;
import java.util.List;

public class BoardDto {
    private String rqstNo; // 게시글 번호 (PK) - String으로 변환
    private String title; // 제목
    private String cont; // 내용
    private String rqstId; // 작성자 ID
    private LocalDateTime insDt; // 등록일시
    private LocalDateTime uptDt; // 수정일시
    private Integer views; // 조회수

    private String boardType; // 게시판 구분 (QNA, SERMONS 등)

    // 답글(계층형) 게시판 필드
    private String groupNo; // 그룹 번호 (최상위 글 번호) - String으로 변환
    private String parentNo; // 부모 글 번호 - String으로 변환
    private Integer depth; // 계층 깊이 (0: 최상위, 1: 답글...)
    private Integer orderNo; // 그룹 내 정렬 순서

    // 파일 업로드 필드
    private boolean hasFile; // 파일 첨부 여부 (목록 표시용)
    private List<FileDto> fileList; // 첨부파일 목록 (상세 조회용)
    private Long totalFileSize; // 첨부파일 총 용량 (목록 표시용)

    private String secret;
    private String password;

    // 댓글 개수 (목록 표시용)
    private Integer commentCount;

    public String getRqstNo() {
        return rqstNo;
    }

    public void setRqstNo(String rqstNo) {
        this.rqstNo = rqstNo;
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

    public Long getTotalFileSize() {
        return totalFileSize;
    }

    public void setTotalFileSize(Long totalFileSize) {
        this.totalFileSize = totalFileSize;
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

    public Integer getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(Integer commentCount) {
        this.commentCount = commentCount;
    }
}
