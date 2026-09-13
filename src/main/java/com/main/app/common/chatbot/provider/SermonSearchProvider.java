package com.main.app.common.chatbot.provider;

import com.main.app.common.chatbot.ChatbotDataProvider;
import com.main.app.official.worship.sermons.SermonService;
import com.main.app.official.worship.sermons.dto.SermonDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class SermonSearchProvider implements ChatbotDataProvider {

    private static final Map<String, List<String>> TOPIC_SYNONYMS = Map.of(
            "믿음", List.of("믿음", "신앙", "확신"),
            "은혜", List.of("은혜", "은총", "자비"),
            "사랑", List.of("사랑", "헌신", "나눔"),
            "기도", List.of("기도", "중보", "간구"),
            "소망", List.of("소망", "희망"),
            "회개", List.of("회개", "용서"),
            "감사", List.of("감사", "찬양"),
            "말씀", List.of("말씀", "성경", "묵상")
    );

    private final SermonService sermonService;

    @Override
    public String intentCode() {
        return "SERMON_SEARCH";
    }

    @Override
    public Map<String, String> resolve(String message) {
        Map<String, String> slots = new LinkedHashMap<>();
        String topic = extractTopic(message);
        Page<SermonDto> page;
        if (topic != null) {
            page = sermonService.getBoardList(0, 5, "sermon_date", "DESC", "all", topic, null);
        } else {
            page = sermonService.getBoardList(0, 5, "sermon_date", "DESC", null, null, null);
        }

        List<SermonDto> sermons = new ArrayList<>();
        if (page != null && page.getContent() != null) {
            for (SermonDto s : page.getContent()) {
                if (s != null && !"Y".equalsIgnoreCase(s.getSecret())) {
                    sermons.add(s);
                }
            }
        }
        if (sermons.isEmpty()) {
            slots.put("sermon_items", "아직 관련 설교를 찾지 못했습니다.");
            return slots;
        }

        StringBuilder sb = new StringBuilder();
        if (topic != null) {
            sb.append("'").append(topic).append("'와 관련된 최근 설교입니다.");
        } else {
            sb.append("최근 설교입니다.");
        }
        for (SermonDto s : sermons) {
            sb.append("\n- ");
            if (s.getSermonDate() != null) {
                sb.append(s.getSermonDate()).append(" ");
            }
            sb.append(s.getTitle());
            sb.append(" (");
            if (s.getScriptureReference() != null && !s.getScriptureReference().isBlank()) {
                sb.append(s.getScriptureReference()).append(", ");
            }
            sb.append(s.getPreacherName() == null ? "" : s.getPreacherName()).append(")");
        }
        sb.append("\n\n전체 설교는 설교 페이지에서 확인하실 수 있습니다.");
        slots.put("sermon_items", sb.toString().trim());
        return slots;
    }

    private String extractTopic(String message) {
        if (message == null || message.isBlank()) {
            return null;
        }
        for (Map.Entry<String, List<String>> entry : TOPIC_SYNONYMS.entrySet()) {
            for (String word : entry.getValue()) {
                if (message.contains(word)) {
                    return entry.getKey();
                }
            }
        }
        String cleaned = message
                .replaceAll("찾아줘|찾아주|찾고|찾는|해줘|해주|알려줘|알려주|보여줘|보여주|대한|관련|주제|말씀|설교|묵상|좀|에서|의|을|를|은|는|로|으로", "")
                .trim();
        return cleaned.length() >= 2 ? cleaned : null;
    }
}
