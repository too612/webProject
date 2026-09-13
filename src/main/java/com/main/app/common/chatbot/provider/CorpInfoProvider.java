package com.main.app.common.chatbot.provider;

import com.main.app.common.chatbot.ChatbotDataProvider;
import com.main.app.common.corp.CorpService;
import com.main.app.common.corp.dto.CorpDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CorpInfoProvider implements ChatbotDataProvider {

    private final CorpService corpService;

    @Override
    public String intentCode() {
        return "LOCATION";
    }

    @Override
    public Map<String, String> resolve(String message) {
        Map<String, String> slots = new LinkedHashMap<>();
        CorpDto corp = corpService.getInfo(null);
        if (corp == null) {
            slots.put("address", "등록된 주소 정보가 없습니다.");
            slots.put("phone", "등록된 연락처 정보가 없습니다.");
            return slots;
        }
        slots.put("address", joinAddress(corp.getAddressLine1(), corp.getAddressLine2()));
        slots.put("phone", corp.getPhoneNumber() == null || corp.getPhoneNumber().isBlank()
                ? "등록된 연락처 정보가 없습니다." : corp.getPhoneNumber());
        return slots;
    }

    private String joinAddress(String line1, String line2) {
        StringBuilder sb = new StringBuilder();
        if (line1 != null && !line1.isBlank()) {
            sb.append(line1);
        }
        if (line2 != null && !line2.isBlank()) {
            if (sb.length() > 0) {
                sb.append(" ");
            }
            sb.append(line2);
        }
        return sb.length() > 0 ? sb.toString() : "등록된 주소 정보가 없습니다.";
    }
}
