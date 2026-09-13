package com.main.app.common.chatbot.provider;

import com.main.app.common.chatbot.ChatbotDataProvider;
import com.main.app.official.training.cellgroup.CellGroupService;
import com.main.app.official.training.cellgroup.dto.CellGroupDto;
import com.main.app.official.training.cellgroup.dto.CellGroupGroupDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CellGroupProvider implements ChatbotDataProvider {

    private final CellGroupService cellGroupService;

    @Override
    public String intentCode() {
        return "CELL_GROUP";
    }

    @Override
    public Map<String, String> resolve(String message) {
        Map<String, String> slots = new LinkedHashMap<>();
        CellGroupDto dto = cellGroupService.getCellGroup();
        if (dto == null || dto.getGroups() == null || dto.getGroups().isEmpty()) {
            slots.put("group_items", "아직 등록된 셀 모임 정보가 없습니다.");
            return slots;
        }
        StringBuilder sb = new StringBuilder();
        if (dto.getSummary() != null && !dto.getSummary().isBlank()) {
            sb.append(dto.getSummary());
        }
        List<CellGroupGroupDto> groups = dto.getGroups();
        int limit = Math.min(groups.size(), 8);
        for (int i = 0; i < limit; i++) {
            CellGroupGroupDto g = groups.get(i);
            sb.append("\n- ").append(g.getTitle());
            if (g.getMeetingInfo() != null && !g.getMeetingInfo().isBlank()) {
                sb.append(" (").append(g.getMeetingInfo()).append(")");
            }
            if (g.getDescription() != null && !g.getDescription().isBlank()) {
                sb.append(": ").append(g.getDescription());
            }
        }
        sb.append("\n\n자세한 내용은 셀가족 공동체 페이지에서 확인하실 수 있습니다.");
        slots.put("group_items", sb.toString().trim());
        return slots;
    }
}
