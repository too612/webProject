package com.main.app.common.chatbot.provider;

import com.main.app.common.chatbot.ChatbotDataProvider;
import com.main.app.community.saint.family.FamilyService;
import com.main.app.community.saint.family.dto.FamilyDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class FamilyNewsProvider implements ChatbotDataProvider {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final FamilyService familyService;

    @Override
    public String intentCode() {
        return "FAMILY_NEWS";
    }

    @Override
    public Map<String, String> resolve(String message) {
        Page<FamilyDto> page = familyService.getList(0, 10, null);
        StringBuilder result = new StringBuilder();
        if (page != null) {
            for (FamilyDto item : page.getContent()) {
                if (item == null || "Y".equalsIgnoreCase(item.getSecret())) {
                    continue;
                }
                result.append("- ").append(item.getTitle());
                if (item.getInsDt() != null) {
                    result.append(" (").append(item.getInsDt().format(DATE_FORMAT)).append(")");
                }
                result.append("\n");
            }
        }
        Map<String, String> slots = new LinkedHashMap<>();
        slots.put("family_items", result.length() == 0
                ? "등록된 경조사 소식이 없습니다."
                : result.toString().trim());
        return slots;
    }
}