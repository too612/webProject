package com.main.app.system.config.code;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.main.app.system.config.code.dto.CodeDto;

import java.util.List;
import java.util.Map;

@Service("systemConfigCodeService")
@RequiredArgsConstructor
public class CodeService {

    private final CodeMapper codeMapper;

    @Transactional(readOnly = true)
    public Map<String, Object> getCodeList(int page, int size, String keyword, String groupCode) {
        int safePage = Math.max(page, 0);
        int safeSize = size <= 0 ? 10 : Math.min(size, 200);
        int offset = safePage * safeSize;

        String normalizedKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;
        String normalizedGroupCode = StringUtils.hasText(groupCode) ? groupCode.trim() : null;

        List<CodeDto> content = codeMapper.selectCodeList(normalizedGroupCode, normalizedKeyword, offset, safeSize);
        long totalElements = codeMapper.countCodeList(normalizedGroupCode, normalizedKeyword);
        int totalPages = totalElements == 0 ? 0 : (int) Math.ceil((double) totalElements / safeSize);

        return Map.of(
                "content", content,
                "totalElements", totalElements,
                "totalPages", totalPages,
                "number", safePage,
                "size", safeSize);
    }
}