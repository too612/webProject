package com.main.app.service.impl;

import com.main.app.mapper.UserMapper;
import com.main.app.model.UserDto;
import com.main.app.service.UserService;

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
        return userMapper.checkUserIdExists(userId) == 0;
    }
    
    @Override
    public boolean isEmailAvailable(String email) {
        return userMapper.checkEmailExists(email) == 0;
    }
    
    @Override
    @Transactional
    public boolean registerUser(UserDto user) {
        try {
            // 비밀번호 암호화
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
            
            // 사용자 등록
            userMapper.insertUser(user);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    @Override
    @Transactional
    public UserDto login(String userId, String password) {
        UserDto user = userMapper.selectUserByUserId(userId);
        
        if (user == null) {
            return null;
        }
        
        // 계정 잠금 확인
        if ("I".equals(user.getStatus())) {
            if (user.getLockExpireDt() != null && 
                LocalDateTime.now().isAfter(user.getLockExpireDt())) {
                // 잠금 시간이 지났으면 잠금 해제
                userMapper.resetLoginFailCnt(userId);
                userMapper.updateStatus(userId, "A");
                user.setStatus("A");
            } else {
                // 아직 잠금 상태
                return null;
            }
        }
        
        // 비밀번호 확인
        if (!passwordEncoder.matches(password, user.getPassword())) {
            // 로그인 실패 횟수 증가
            userMapper.increaseLoginFailCnt(userId);
            
            // 실패 횟수 확인 후 계정 잠금
            Integer failCnt = user.getLoginFailCnt() != null ? user.getLoginFailCnt() : 0;
            if (failCnt + 1 >= MAX_LOGIN_FAIL_CNT) {
                LocalDateTime lockExpireDt = LocalDateTime.now().plusMinutes(LOCK_TIME_MINUTES);
                userMapper.lockAccount(userId, lockExpireDt.toString());
            }
            
            return null;
        }
        
        // 로그인 성공
        userMapper.resetLoginFailCnt(userId);
        userMapper.updateLastLoginDt(userId);
        
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
            UserDto user = userMapper.selectUserByUserId(userId);
            
            if (user == null) {
                return false;
            }
            
            // 현재 비밀번호 확인
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                return false;
            }
            
            // 새 비밀번호 암호화 및 저장
            String encodedPassword = passwordEncoder.encode(newPassword);
            userMapper.updatePassword(userId, encodedPassword);
            
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
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
