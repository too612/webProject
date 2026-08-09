package com.main.app.common.auth;

import com.main.app.common.auth.dto.UserPermissionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionMapper permissionMapper;

    public List<String> getUserRoleIds(String userId) {
        if (userId == null || userId.isBlank()) {
            return List.of();
        }
        try {
            return permissionMapper.selectRoleIdsByUserId(userId);
        } catch (Exception ex) {
            return List.of();
        }
    }

    public Map<String, Object> getEffectivePermissions(String userId) {
        if (userId == null || userId.isBlank()) {
            return Map.of("roles", List.of(), "permissions", Map.of());
        }

        try {
            List<String> roles = getUserRoleIds(userId);
            List<UserPermissionDto> permissions = permissionMapper.selectEffectivePermissionsByUserId(userId);

            Map<String, Map<String, Object>> permissionMap = new LinkedHashMap<>();
            for (UserPermissionDto permission : permissions) {
                if (permission == null || permission.getProgramId() == null || permission.getProgramId().isBlank()) {
                    continue;
                }

                Map<String, Object> entry = permissionMap.computeIfAbsent(permission.getProgramId(), key -> new LinkedHashMap<>());
                entry.put("programId", permission.getProgramId());
                entry.put("canRead", Boolean.TRUE.equals(permission.getCanRead()) || Boolean.TRUE.equals(entry.get("canRead")));
                entry.put("canWrite", Boolean.TRUE.equals(permission.getCanWrite()) || Boolean.TRUE.equals(entry.get("canWrite")));
                entry.put("canUpdate", Boolean.TRUE.equals(permission.getCanUpdate()) || Boolean.TRUE.equals(entry.get("canUpdate")));
                entry.put("canDelete", Boolean.TRUE.equals(permission.getCanDelete()) || Boolean.TRUE.equals(entry.get("canDelete")));
                entry.put("isOpen", Boolean.TRUE.equals(permission.getIsOpen()) || Boolean.TRUE.equals(entry.get("isOpen")));
            }

            return Map.of("roles", roles, "permissions", permissionMap);
        } catch (Exception ex) {
            return Map.of("roles", List.of(), "permissions", Map.of());
        }
    }
}
