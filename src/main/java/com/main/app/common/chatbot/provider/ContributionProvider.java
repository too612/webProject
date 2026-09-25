package com.main.app.common.chatbot.provider;

import com.main.app.common.chatbot.ChatbotDataProvider;
import com.main.app.official.about.contribution.ContributionService;
import com.main.app.official.about.contribution.dto.ContributionAccountDto;
import com.main.app.official.about.contribution.dto.ContributionDto;
import com.main.app.official.about.contribution.dto.ContributionRuleDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ContributionProvider implements ChatbotDataProvider {

    private final ContributionService contributionService;

    @Override
    public String intentCode() {
        return "CONTRIBUTION";
    }

    @Override
    public Map<String, String> resolve(String message) {
        ContributionDto contribution = contributionService.getInfo();
        Map<String, String> slots = new LinkedHashMap<>();
        if (contribution == null) {
            slots.put("contribution_info", "온라인헌금 정보를 확인할 수 없습니다.");
            return slots;
        }

        StringBuilder result = new StringBuilder();
        if (contribution.getAccounts() != null) {
            for (ContributionAccountDto account : contribution.getAccounts()) {
                result.append("- ").append(account.getAccountLabel()).append(": ")
                        .append(account.getBankName()).append(" ")
                        .append(account.getAccountNumber()).append("\n");
            }
        }
        if (contribution.getRules() != null && !contribution.getRules().isEmpty()) {
            result.append("\n헌금 표기 방법:\n");
            for (ContributionRuleDto rule : contribution.getRules()) {
                result.append("- ").append(rule.getPurpose()).append(": ")
                        .append(rule.getAbbreviation()).append("\n");
            }
        }
        slots.put("contribution_info", result.toString().trim());
        return slots;
    }
}