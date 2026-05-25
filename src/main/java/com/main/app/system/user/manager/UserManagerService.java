package com.main.app.system.user.manager;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service("systemUserManagerService")
@RequiredArgsConstructor
public class UserManagerService {

    private final UserManagerMapper userManagerMapper;

    @Transactional(readOnly = true)
    public Map<String, Object> getUserList(int page, int size, String keyword) {
        return Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size);
    }
}