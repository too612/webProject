package com.main.app.common.chatbot.provider;

import com.main.app.common.chatbot.ChatbotDataProvider;
import com.main.app.common.chatbot.PersonnelMapper;
import com.main.app.common.chatbot.dto.PersonnelCountDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class PersonnelProvider implements ChatbotDataProvider {

    private final PersonnelMapper personnelMapper;

    @Override
    public String intentCode() {
        return "PERSONNEL_COUNT";
    }

    @Override
    public Map<String, String> resolve(String message) {
        Map<String, String> slots = new LinkedHashMap<>();
        List<PersonnelCountDto> rows = personnelMapper.selectRoleCounts();
        if (rows == null || rows.isEmpty()) {
            slots.put("personnel_items", "아직 등록된 인사 정보가 없습니다.");
            return slots;
        }

        String target = detectRole(message);
        StringBuilder sb = new StringBuilder();
        if (target != null) {
            int total = 0;
            for (PersonnelCountDto row : rows) {
                if (row.getRoleName() != null && row.getRoleName().contains(target)) {
                    total += row.getCount();
                }
            }
            sb.append("현재 등록된 ").append(target).append("는 ").append(total).append("명입니다.");
        } else {
            sb.append("현재 등록된 직분별 인원입니다.");
            for (PersonnelCountDto row : rows) {
                sb.append("\n- ").append(row.getRoleName()).append(": ").append(row.getCount()).append("명");
            }
        }
        slots.put("personnel_items", sb.toString().trim());
        return slots;
    }

    private String detectRole(String message) {
        if (message == null) {
            return null;
        }
        List<String> roles = List.of("안수집사", "피택장로", "은퇴장로", "장로", "권사", "집사");
        for (String role : roles) {
            if (message.contains(role)) {
                return role;
            }
        }
        return null;
    }
}
