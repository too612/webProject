package com.main.app.auth.service.impl;

import com.main.app.auth.mapper.UserMapper;
import com.main.app.auth.dto.UserDto;
import com.main.app.auth.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 로그인 실패 최대 횟수
    private static final int MAX_LOGIN_FAIL_CNT = 5;
    // 계정 잠금 시간 (분)
    private static final int LOCK_TIME_MINUTES = 30;

    @Override
    public UserDto getUserByUserId(String userId) {
        return userMapper.selectUserByUserId(userId);
    }

    @Override
    public UserDto getUserBySeq(Long userSeq) {
        return userMapper.selectUserBySeq(userSeq);
    }

    @Override
    public UserDto getUserByEmail(String email) {
        return userMapper.selectUserByEmail(email);
    }

    @Override
    public boolean isUserIdAvailable(String userId) {
        int count = userMapper.checkUserIdExists(userId);
        System.out.println("[중복확인] 아이디: " + userId + " => 기존 사용자 수: " + count);
        return count == 0;
    }

    @Override
    public boolean isEmailAvailable(String email) {
        int count = userMapper.checkEmailExists(email);
        System.out.println("[중복확인] 이메일: " + email + " => 기존 이메일 수: " + count);
        return count == 0;
    }

    @Override
    @Transactional
    public boolean registerUser(UserDto user) {
        try {
            // 입력값 검증
            if (user.getUserId() == null || user.getUserId().isEmpty()) {
                throw new IllegalArgumentException("사용자 ID가 비어있습니다.");
            }
            if (user.getPassword() == null || user.getPassword().isEmpty()) {
                throw new IllegalArgumentException("비밀번호가 비어있습니다.");
            }
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                throw new IllegalArgumentException("이메일이 비어있습니다.");
            }

            // 비밀번호 암호화
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            System.out.println("\n┌─ [서비스] 비밀번호 인코딩 완료");
            System.out.println("├─ 인코딩 후 길이: " + encodedPassword.length() + "자");
            System.out.println(
                    "└─ 인코딩 샘플: " + encodedPassword.substring(0, Math.min(20, encodedPassword.length())) + "...");
            user.setPassword(encodedPassword);

            // Boolean 값 처리 (null인 경우 false로 설정)
            if (user.getAgreeTerms() == null) {
                user.setAgreeTerms(false);
            }
            if (user.getAgreePrivacy() == null) {
                user.setAgreePrivacy(false);
            }
            if (user.getAgreeMarketing() == null) {
                user.setAgreeMarketing(false);
            }

            // Gender 값 처리 (빈 문자열을 null로 변환)
            if (user.getGender() != null && user.getGender().trim().isEmpty()) {
                user.setGender(null);
            }

            System.out.println("\n┌─ [서비스] Boolean 값 처리 완료");
            System.out.println("├─ agreeTerms: " + user.getAgreeTerms());
            System.out.println("├─ agreePrivacy: " + user.getAgreePrivacy());
            System.out.println("├─ agreeMarketing: " + user.getAgreeMarketing());
            System.out.println("└─ gender: " + (user.getGender() == null ? "null" : user.getGender()));

            // 사용자 등록
            System.out.println("\n┌─ [서비스] UserMapper.insertUser() 호출 직전");
            System.out.println("└─ 파라미터 준비 완료");
            int result = userMapper.insertUser(user);
            System.out.println("\n┌─ [서비스] UserMapper.insertUser() 완료");
            System.out.println("├─ Insert Result: " + result);
            System.out.println("└─ 성공 여부: " + (result > 0 ? "✓ 성공" : "✗ 실패"));

            return result > 0;
        } catch (Exception e) {
            System.err.println("\n╔════════════════════════════════════════════════════════════╗");
            System.err.println("║ 회원가입 오류 발생                                         ║");
            System.err.println("╚════════════════════════════════════════════════════════════╝");
            System.err.println("[오류 클래스] " + e.getClass().getName());
            System.err.println("[오류 메시지] " + e.getMessage());
            System.err.println("[스택 트레이스]");
            e.printStackTrace();
            return false;
        }
    }

    @Override
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
                // 아직 잠금 상태면 컨트롤러가 잠금 메시지를 보여줄 수 있도록 사용자 정보를 반환
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
            // 레거시 평문 비밀번호 호환 처리
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

        // 비밀번호는 null로 설정 (보안)
        user.setPassword(null);

        return user;
    }

    @Override
    @Transactional
    public boolean updateUser(UserDto user) {
        try {
            userMapper.updateUser(user);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
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

            // 새 비밀번호 암호화 및 저장
            String encodedPassword = passwordEncoder.encode(newPassword);
            userMapper.updatePassword(normalizedUserId, encodedPassword);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private boolean isBcryptHash(String value) {
        return value != null && value.matches("^\\$2[aby]\\$.{56}$");
    }

    @Override
    @Transactional
    public boolean updateStatus(String userId, String status) {
        try {
            userMapper.updateStatus(userId, status);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
