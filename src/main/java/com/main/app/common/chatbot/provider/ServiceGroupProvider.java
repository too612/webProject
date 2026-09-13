package com.main.app.common.chatbot.provider;

import com.main.app.common.chatbot.ChatbotDataProvider;
import com.main.app.official.training.servicegroup.ServiceGroupService;
import com.main.app.official.training.servicegroup.dto.ServiceGroupDto;
import com.main.app.official.training.servicegroup.dto.ServiceGroupGroupDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ServiceGroupProvider implements ChatbotDataProvider {

    private final ServiceGroupService serviceGroupService;

    @Override
    public String intentCode() {
        return "SERVICE_GROUP";
    }

    @Override
    public Map<String, String> resolve(String message) {
        Map<String, String> slots = new LinkedHashMap<>();
        ServiceGroupDto dto = serviceGroupService.getServiceGroup();
        if (dto == null || dto.getGroups() == null || dto.getGroups().isEmpty()) {
            slots.put("group_items", "아직 등록된 부서 정보가 없습니다.");
            return slots;
        }
        StringBuilder sb = new StringBuilder();
        if (dto.getSummary() != null && !dto.getSummary().isBlank()) {
            sb.append(dto.getSummary());
        }
        List<ServiceGroupGroupDto> groups = dto.getGroups();
        int limit = Math.min(groups.size(), 8);
        for (int i = 0; i < limit; i++) {
            ServiceGroupGroupDto g = groups.get(i);
            sb.append("\n- ").append(g.getTitle());
            if (g.getDescription() != null && !g.getDescription().isBlank()) {
                sb.append(": ").append(g.getDescription());
            }
            if (g.getLeaderName() != null && !g.getLeaderName().isBlank()) {
                sb.append(" (담당: ").append(g.getLeaderName()).append(")");
            }
        }
        sb.append("\n\n자세한 내용은 섬기는 공동체 페이지에서 확인하실 수 있습니다.");
        slots.put("group_items", sb.toString().trim());
        return slots;
    }
}
