package com.main.app.common.auth;

import com.main.app.common.auth.dto.UserDto;
import com.main.app.common.auth.dto.TermsPolicyDto;
import com.main.app.common.auth.dto.UserTermsConsentDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {

    /**
     * 사용자 ID로 사용자 정보 조회
     * 
     * @param userId 사용자 ID
     * @return 사용자 정보
     */
    UserDto selectUserByUserId(@Param("userId") String userId);

    /**
     * 사용자 일련번호로 사용자 정보 조회
     * 
     * @param userSeq 사용자 일련번호
     * @return 사용자 정보
     */
    UserDto selectUserBySeq(@Param("userSeq") Long userSeq);

    /**
     * 이메일로 사용자 정보 조회
     * 
     * @param email 이메일
     * @return 사용자 정보
     */
    UserDto selectUserByEmail(@Param("email") String email);

    /**
     * 이름과 이메일로 사용자 정보 조회
     *
     * @param userName 사용자 이름
     * @param email 이메일
     * @return 사용자 정보
     */
    UserDto selectUserByNameAndEmail(@Param("userName") String userName, @Param("email") String email);

    /**
     * 사용자 ID와 이메일로 사용자 정보 조회
     *
     * @param userId 사용자 ID
     * @param email 이메일
     * @return 사용자 정보
     */
    UserDto selectUserByUserIdAndEmail(@Param("userId") String userId, @Param("email") String email);

    /**
     * 사용자 ID 중복 체크
     * 
     * @param userId 사용자 ID
     * @return 존재하면 1, 아니면 0
     */
    int checkUserIdExists(@Param("userId") String userId);

    /**
     * 이메일 중복 체크
     * 
     * @param email 이메일
     * @return 존재하면 1, 아니면 0
     */
    int checkEmailExists(@Param("email") String email);

    /**
     * 사용자 등록
     * 
     * @param user 사용자 정보
     * @return 등록된 행 수
     */
    int insertUser(UserDto user);

    /**
     * 사용자 정보 수정
     * 
     * @param user 사용자 정보
     */
    void updateUser(UserDto user);

    /**
     * 마지막 로그인 일시 업데이트
     * 
     * @param userId 사용자 ID
     */
    void updateLastLoginDt(@Param("userId") String userId);

    /**
     * 로그인 실패 횟수 증가
     * 
     * @param userId 사용자 ID
     */
    void increaseLoginFailCnt(@Param("userId") String userId);

    /**
     * 로그인 실패 횟수 초기화
     * 
     * @param userId 사용자 ID
     */
    void resetLoginFailCnt(@Param("userId") String userId);

    /**
     * 계정 잠금 설정
     * 
     * @param userId       사용자 ID
     * @param lockExpireDt 잠금 해제 일시
     */
    void lockAccount(@Param("userId") String userId, @Param("lockExpireDt") String lockExpireDt);

    /**
     * 계정 상태 변경
     * 
     * @param userId 사용자 ID
     * @param status 상태 (A: 활성, I: 비활성, D: 삭제)
     */
    void updateStatus(@Param("userId") String userId, @Param("status") String status);

    /**
     * 비밀번호 변경
     * 
     * @param userId   사용자 ID
     * @param password 새 비밀번호 (암호화된)
     */
    void updatePassword(@Param("userId") String userId, @Param("password") String password);

    /**
     * 활성 약관 버전 조회
     *
     * @param termsType 약관 타입 (TERMS, PRIVACY, MARKETING)
     * @return 활성 약관 버전
     */
    String selectActiveTermsVersion(@Param("termsType") String termsType);

    /**
     * 사용자 약관 동의 이력 저장
     *
     * @param consent 동의 이력 정보
     * @return 저장된 행 수
     */
    int insertUserTermsConsent(UserTermsConsentDto consent);

    /**
     * 활성 약관 목록 조회
     *
     * @return 약관 목록
     */
    List<TermsPolicyDto> selectActiveTermsPolicies();
}
