package com.main.app.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class UserDto {
    private Long userSeq;           // 사용자 시퀀스 (PK)
    private String userId;          // 사용자 ID (로그인용)
    private String password;        // 비밀번호 (암호화 저장)
    private String userName;        // 사용자 이름
    private String email;           // 이메일
    private String phone;           // 휴대폰 번호
    private LocalDate birthDate;    // 생년월일
    private String gender;          // 성별 (M: 남성, F: 여성)
    private String status;          // 계정 상태 (A: 활성, I: 비활성, D: 삭제)
    private Boolean agreeTerms;     // 이용약관 동의
    private Boolean agreePrivacy;   // 개인정보 수집 동의
    private Boolean agreeMarketing; // 마케팅 정보 수신 동의
    private LocalDateTime insDt;    // 가입일시
    private LocalDateTime uptDt;    // 수정일시
    private LocalDateTime lastLoginDt; // 마지막 로그인 일시
    private Integer loginFailCnt;   // 로그인 실패 횟수
    private LocalDateTime lockExpireDt; // 계정 잠금 해제 일시
}
