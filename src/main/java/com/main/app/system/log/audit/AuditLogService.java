package com.main.app.system.log.audit;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service("systemLogAuditService")
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogMapper auditLogMapper;

    @Transactional(readOnly = true)
    public Map<String, Object> getAuditLogList(int page, int size, String keyword) {
        return Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size);
    }
}