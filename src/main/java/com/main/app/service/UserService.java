package com.main.app.service;

import com.main.app.model.UserDto;

public interface UserService {
    
    /**
     * 사용자 ID로 사용자 정보 조회
     * @param userId 사용자 ID
     * @return 사용자 정보
     */
    UserDto getUserByUserId(String userId);
    
    /**
     * 사용자 시퀀스로 사용자 정보 조회
     * @param userSeq 사용자 시퀀스
     * @return 사용자 정보
     */
    UserDto getUserBySeq(Long userSeq);
    
    /**
     * 이메일로 사용자 정보 조회
     * @param email 이메일
     * @return 사용자 정보
     */
    UserDto getUserByEmail(String email);
    
    /**
     * 사용자 ID 중복 체크
     * @param userId 사용자 ID
     * @return 사용 가능하면 true, 이미 존재하면 false
     */
    boolean isUserIdAvailable(String userId);
    
    /**
     * 이메일 중복 체크
     * @param email 이메일
     * @return 사용 가능하면 true, 이미 존재하면 false
     */
    boolean isEmailAvailable(String email);
    
    /**
     * 회원 가입
     * @param user 사용자 정보
     * @return 등록 성공 여부
     */
    boolean registerUser(UserDto user);
    
    /**
     * 로그인
     * @param userId 사용자 ID
     * @param password 비밀번호 (평문)
     * @return 로그인 성공한 사용자 정보, 실패시 null
     */
    UserDto login(String userId, String password);
    
    /**
     * 사용자 정보 수정
     * @param user 사용자 정보
     * @return 수정 성공 여부
     */
    boolean updateUser(UserDto user);
    
    /**
     * 비밀번호 변경
     * @param userId 사용자 ID
     * @param currentPassword 현재 비밀번호
     * @param newPassword 새 비밀번호
     * @return 변경 성공 여부
     */
    boolean changePassword(String userId, String currentPassword, String newPassword);
    
    /**
     * 계정 상태 변경
     * @param userId 사용자 ID
     * @param status 상태 (A: 활성, I: 비활성, D: 삭제)
     * @return 변경 성공 여부
     */
    boolean updateStatus(String userId, String status);
}
