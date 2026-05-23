package com.main.app.common.auth.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class UserDto {
    private Long userSeq; // 사용자 일련번호(PK)
    private String userId; // 사용자 ID (로그인용)
    private String password; // 비밀번호 (암호화 저장)
    private String userName; // 사용자 이름
    private String email; // 이메일
    private String phone; // 전화번호
    private LocalDate birthDate; // 생년월일
    private String gender; // 성별 (M: 남성, F: 여성)
    private String status; // 계정 상태 (A: 활성, I: 비활성, D: 삭제)
    private Boolean agreeTerms; // 이용약관 동의
    private Boolean agreePrivacy; // 개인정보처리방침 동의
    private Boolean agreeMarketing; // 마케팅 정보 수신 동의
    private LocalDateTime insDt; // 등록일시
    private LocalDateTime uptDt; // 수정일시
    private LocalDateTime lastLoginDt; // 마지막 로그인 일시
    private Integer loginFailCnt; // 로그인 실패 횟수
    private LocalDateTime lockExpireDt; // 계정 잠금 해제 일시

    public Long getUserSeq() {
        return userSeq;
    }

    public void setUserSeq(Long userSeq) {
        this.userSeq = userSeq;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getAgreeTerms() {
        return agreeTerms;
    }

    public void setAgreeTerms(Boolean agreeTerms) {
        this.agreeTerms = agreeTerms;
    }

    public Boolean getAgreePrivacy() {
        return agreePrivacy;
    }

    public void setAgreePrivacy(Boolean agreePrivacy) {
        this.agreePrivacy = agreePrivacy;
    }

    public Boolean getAgreeMarketing() {
        return agreeMarketing;
    }

    public void setAgreeMarketing(Boolean agreeMarketing) {
        this.agreeMarketing = agreeMarketing;
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

    public LocalDateTime getLastLoginDt() {
        return lastLoginDt;
    }

    public void setLastLoginDt(LocalDateTime lastLoginDt) {
        this.lastLoginDt = lastLoginDt;
    }

    public Integer getLoginFailCnt() {
        return loginFailCnt;
    }

    public void setLoginFailCnt(Integer loginFailCnt) {
        this.loginFailCnt = loginFailCnt;
    }

    public LocalDateTime getLockExpireDt() {
        return lockExpireDt;
    }

    public void setLockExpireDt(LocalDateTime lockExpireDt) {
        this.lockExpireDt = lockExpireDt;
    }
}