package com.main.app.mypage.user.password;

import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class PasswordService {

    public Map<String, Object> getPasswordPolicy() {
        Map<String, Object> policy = new LinkedHashMap<>();
        policy.put("minLength", 8);
        policy.put("requireSpecialChar", true);
        policy.put("requireNumber", true);
        policy.put("requireAlphabet", true);
        return policy;
    }
}
