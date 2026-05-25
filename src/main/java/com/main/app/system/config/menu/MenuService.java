package com.main.app.system.config.menu;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service("systemConfigMenuService")
@RequiredArgsConstructor
public class MenuService {

    private final MenuMapper menuMapper;

    @Transactional(readOnly = true)
    public Map<String, Object> getMenuList(int page, int size) {
        return Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size);
    }
}