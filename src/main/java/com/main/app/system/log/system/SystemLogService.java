package com.main.app.system.log.system;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service("systemLogSystemService")
@RequiredArgsConstructor
public class SystemLogService {

    private final SystemLogMapper systemLogMapper;

    @Transactional(readOnly = true)
    public Map<String, Object> getSystemLogList(int page, int size, String keyword) {
        return Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size);
    }
}