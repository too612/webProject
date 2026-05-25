package com.main.app.system.backup.policy;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service("systemBackupPolicyService")
@RequiredArgsConstructor
public class PolicyService {

    private final PolicyMapper policyMapper;

    @Transactional(readOnly = true)
    public Map<String, Object> getPolicyList(int page, int size) {
        return Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size);
    }
}