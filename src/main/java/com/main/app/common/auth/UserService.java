package com.main.app.common.auth;

import com.main.app.common.auth.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserMapper userMapper;

    private final PasswordEncoder passwordEncoder;

    // 로그인 실패 최대 횟수
    private static final int MAX_LOGIN_FAIL_CNT = 5;
    // 계정 잠금 시간 (분)
    private static final int LOCK_TIME_MINUTES = 30;

    /**
     * 사용자 ID로 사용자 정보 조회
     * 
     * @param userId 사용자 ID
     * @return 사용자 정보
     */
    public UserDto getUserByUserId(String userId) {
        return userMapper.selectUserByUserId(userId);
    }

    /**
     * 사용자 시퀀스로 사용자 정보 조회
     * 
     * @param userSeq 사용자 시퀀스
     * @return 사용자 정보
     */
    public UserDto getUserBySeq(Long userSeq) {
        return userMapper.selectUserBySeq(userSeq);
    }

    /**
     * 이메일로 사용자 정보 조회
     * 
     * @param email 이메일
     * @return 사용자 정보
     */
    public UserDto getUserByEmail(String email) {
        return userMapper.selectUserByEmail(email);
    }

    /**
     * 사용자 ID 중복 체크
     * 
     * @param userId 사용자 ID
     * @return 사용 가능하면 true, 이미 존재하면 false
     */
    public boolean isUserIdAvailable(String userId) {
        int count = userMapper.checkUserIdExists(userId);
        log.debug("아이디 중복 확인: 사용자아이디={}, 조회건수={}", userId, count);
        return count == 0;
    }

    /**
     * 이메일 중복 체크
     * 
     * @param email 이메일
     * @return 사용 가능하면 true, 이미 존재하면 false
     */
    public boolean isEmailAvailable(String email) {
        int count = userMapper.checkEmailExists(email);
        log.debug("이메일 중복 확인: 이메일={}, 조회건수={}", email, count);
        return count == 0;
    }

    /**
     * 회원 가입
     * 
     * @param user 사용자 정보
     * @return 등록 성공 여부
     */
    @Transactional
    public boolean registerUser(UserDto user) {
        try {
            // 입력값 검증
            if (user.getUserId() == null || user.getUserId().isEmpty()) {
                throw new IllegalArgumentException("사용자 ID가 비어 있습니다.");
            }
            if (user.getPassword() == null || user.getPassword().isEmpty()) {
                throw new IllegalArgumentException("비밀번호가 비어 있습니다.");
            }
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                throw new IllegalArgumentException("이메일이 비어 있습니다.");
            }

            // 비밀번호 암호화
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            log.debug("비밀번호 인코딩 완료: 인코딩길이={}", encodedPassword.length());
            user.setPassword(encodedPassword);

            // Boolean 값 처리 (null은 false)
            if (user.getAgreeTerms() == null) {
                user.setAgreeTerms(false);
            }
            if (user.getAgreePrivacy() == null) {
                user.setAgreePrivacy(false);
            }
            if (user.getAgreeMarketing() == null) {
                user.setAgreeMarketing(false);
            }

            // Gender 값 처리 (빈 문자열은 null)
            if (user.getGender() != null && user.getGender().trim().isEmpty()) {
                user.setGender(null);
            }

            log.debug("회원가입 입력값 정규화 완료: 약관동의={}, 개인정보동의={}, 마케팅동의={}, 성별={}",
                    user.getAgreeTerms(), user.getAgreePrivacy(), user.getAgreeMarketing(), user.getGender());

            // 사용자 등록
            int result = userMapper.insertUser(user);
            log.debug("회원가입 저장 완료: 저장결과={}", result);

            return result > 0;
        } catch (Exception e) {
            log.error("회원가입 처리 중 오류 발생", e);
            return false;
        }
    }

    /**
     * 로그인
     * 
     * @param userId   사용자 ID
     * @param password 비밀번호(평문)
     * @return 로그인 성공 시 사용자 정보, 실패 시 null
     */
    @Transactional
    public UserDto login(String userId, String password) {
        String normalizedUserId = userId != null ? userId.trim() : null;
        String rawPassword = password != null ? password : "";

        if (normalizedUserId == null || normalizedUserId.isEmpty() || rawPassword.isEmpty()) {
            return null;
        }

        UserDto user = userMapper.selectUserByUserId(normalizedUserId);

        if (user == null) {
            return null;
        }

        // 계정 잠금 확인
        if ("I".equals(user.getStatus())) {
            if (user.getLockExpireDt() != null &&
                    LocalDateTime.now().isAfter(user.getLockExpireDt())) {
                // 잠금 시간이 지났으면 잠금 해제
                userMapper.resetLoginFailCnt(normalizedUserId);
                userMapper.updateStatus(normalizedUserId, "A");
                user.setStatus("A");
            } else {
                // 아직 잠금 상태면 컨트롤러에서 안내 메시지를 처리하도록 사용자 정보를 반환
                return user;
            }
        }

        // 비밀번호 확인
        String storedPassword = user.getPassword();
        boolean passwordMatched;

        if (storedPassword == null || storedPassword.isEmpty()) {
            passwordMatched = false;
        } else if (isBcryptHash(storedPassword)) {
            passwordMatched = passwordEncoder.matches(rawPassword, storedPassword);
        } else {
            // 과거 평문 비밀번호 호환 처리
            passwordMatched = rawPassword.equals(storedPassword);
            if (passwordMatched) {
                String encodedPassword = passwordEncoder.encode(rawPassword);
                userMapper.updatePassword(normalizedUserId, encodedPassword);
            }
        }

        if (!passwordMatched) {
            // 로그인 실패 횟수 증가
            userMapper.increaseLoginFailCnt(normalizedUserId);

            // 실패 횟수 확인 후 계정 잠금
            Integer failCnt = user.getLoginFailCnt() != null ? user.getLoginFailCnt() : 0;
            if (failCnt + 1 >= MAX_LOGIN_FAIL_CNT) {
                LocalDateTime lockExpireDt = LocalDateTime.now().plusMinutes(LOCK_TIME_MINUTES);
                userMapper.lockAccount(normalizedUserId, lockExpireDt.toString());
            }

            return null;
        }

        // 로그인 성공
        userMapper.resetLoginFailCnt(normalizedUserId);
        userMapper.updateLastLoginDt(normalizedUserId);

        // 보안을 위해 비밀번호 제거
        user.setPassword(null);

        return user;
    }

    /**
     * 사용자 정보 수정
     * 
     * @param user 사용자 정보
     * @return 수정 성공 여부
     */
    @Transactional
    public boolean updateUser(UserDto user) {
        try {
            userMapper.updateUser(user);
            return true;
        } catch (Exception e) {
            log.error("회원정보 수정 중 오류 발생. userId={}", user.getUserId(), e);
            return false;
        }
    }

    /**
     * 비밀번호 변경
     * 
     * @param userId          사용자 ID
     * @param currentPassword 현재 비밀번호
     * @param newPassword     새 비밀번호
     * @return 변경 성공 여부
     */
    @Transactional
    public boolean changePassword(String userId, String currentPassword, String newPassword) {
        try {
            String normalizedUserId = userId != null ? userId.trim() : null;
            if (normalizedUserId == null || normalizedUserId.isEmpty()) {
                return false;
            }

            UserDto user = userMapper.selectUserByUserId(normalizedUserId);

            if (user == null) {
                return false;
            }

            // 현재 비밀번호 확인
            String storedPassword = user.getPassword();
            boolean currentPasswordMatched;

            if (storedPassword == null || storedPassword.isEmpty()) {
                currentPasswordMatched = false;
            } else if (isBcryptHash(storedPassword)) {
                currentPasswordMatched = passwordEncoder.matches(currentPassword, storedPassword);
            } else {
                currentPasswordMatched = currentPassword.equals(storedPassword);
            }

            if (!currentPasswordMatched) {
                return false;
            }

            // 새 비밀번호 암호화 후 저장
            String encodedPassword = passwordEncoder.encode(newPassword);
            userMapper.updatePassword(normalizedUserId, encodedPassword);

            return true;
        } catch (Exception e) {
            log.error("비밀번호 변경 중 오류 발생. userId={}", userId, e);
            return false;
        }
    }

    private boolean isBcryptHash(String value) {
        return value != null && value.matches("^\\$2[aby]\\$.{56}$");
    }

    /**
     * 계정 상태 변경
     * 
     * @param userId 사용자 ID
     * @param status 상태 (A: 활성, I: 비활성, D: 삭제)
     * @return 변경 성공 여부
     */
    @Transactional
    public boolean updateStatus(String userId, String status) {
        try {
            userMapper.updateStatus(userId, status);
            return true;
        } catch (Exception e) {
            log.error("계정 상태 변경 중 오류 발생. userId={}, status={}", userId, status, e);
            return false;
        }
    }
}
