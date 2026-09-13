package com.main.app.common.chatbot.provider;

import com.main.app.common.chatbot.ChatbotDataProvider;
import com.main.app.official.index.OfficialIndexService;
import com.main.app.official.index.dto.OfficialIndexDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class GalleryProvider implements ChatbotDataProvider {

    private final OfficialIndexService officialIndexService;

    @Override
    public String intentCode() {
        return "GALLERY";
    }

    @Override
    public Map<String, String> resolve(String message) {
        Map<String, String> slots = new LinkedHashMap<>();
        List<OfficialIndexDto.GalleryItem> items = officialIndexService.getIndexData().getRecentGalleries();
        if (items == null || items.isEmpty()) {
            slots.put("gallery_items", "아직 등록된 앨범이 없습니다.");
            return slots;
        }
        StringBuilder sb = new StringBuilder();
        for (OfficialIndexDto.GalleryItem item : items) {
            sb.append("- ").append(item.getDate() == null ? "" : item.getDate())
                    .append(" ").append(item.getTitle()).append("\n");
        }
        slots.put("gallery_items", sb.toString().trim());
        return slots;
    }
}
