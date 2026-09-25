package com.main.app.common.chatbot.provider;

import com.main.app.common.chatbot.ChatbotDataProvider;
import com.main.app.official.nextgen.school.ChildrenService;
import com.main.app.official.nextgen.school.dto.ChildrenDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ChildrenProvider implements ChatbotDataProvider {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final ChildrenService childrenService;

    @Override
    public String intentCode() {
        return "CHILDREN";
    }

    @Override
    public Map<String, String> resolve(String message) {
        Map<String, String> slots = new LinkedHashMap<>();
        var page = childrenService.getBoardList(PageRequest.of(0, 5), "all", null);
        StringBuilder result = new StringBuilder();
        if (page != null) {
            for (ChildrenDto item : page.getContent()) {
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
        slots.put("children_items", result.length() == 0
                ? "아직 등록된 주일학교 소식이 없습니다."
                : result.toString().trim());
        return slots;
    }
}