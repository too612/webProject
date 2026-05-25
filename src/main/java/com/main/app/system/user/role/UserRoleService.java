package com.main.app.system.user.role;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service("systemUserRoleService")
@RequiredArgsConstructor
public class UserRoleService {

    private final UserRoleMapper userRoleMapper;

    @Transactional(readOnly = true)
    public Map<String, Object> getRoleList(int page, int size) {
        return Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size);
    }
}