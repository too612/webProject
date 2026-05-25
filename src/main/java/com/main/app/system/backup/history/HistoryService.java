package com.main.app.system.backup.history;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service("systemBackupHistoryService")
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryMapper historyMapper;

    @Transactional(readOnly = true)
    public Map<String, Object> getHistoryList(int page, int size, String keyword) {
        return Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size);
    }
}