package com.main.app.common.chatbot;

import com.main.app.common.chatbot.dto.ChatbotKnowledgeDto;
import com.main.app.common.chatbot.dto.ChatbotRequest;
import com.main.app.common.chatbot.dto.ChatbotResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service("commonChatbotService")
@Slf4j
@RequiredArgsConstructor
public class ChatbotService {

    private static final int MAX_INPUT_LENGTH = 500;
    private static final Pattern SLOT_PATTERN = Pattern.compile("\\{\\{(\\w+)}}");
    private static final Pattern LEGACY_NULL_PATTERN = Pattern.compile("(?i)\\bNULL\\b");
    private static final int MAX_SUGGESTIONS = 4;
        private static final String MODERATION_REPLY =
            "죄송해요, 비속어가 포함된 질문에는 답변할 수 없습니다.\n"
                + "예배시간, 교회 위치, 공지사항처럼 궁금한 내용을 정중하게 질문해 주세요.";
    private static final String FALLBACK_REPLY =
            "죄송해요, 아직 해당 질문에 대한 답변을 준비 중입니다.\n"
                    + "예배시간, 오시는 길, 담임목사 소개, 공지사항 등에 대해 안내해 드릴 수 있어요.";

    private final ChatbotMapper chatbotMapper;
    private final List<ChatbotDataProvider> dataProviders;
    private final ChatbotModerationService moderationService;
    private final ChatbotMenuMatcher menuMatcher;

    @Transactional(readOnly = true)
    public ChatbotResponse reply(ChatbotRequest request) {
        String normalized = normalize(request);

        if (moderationService.isBlocked(request == null ? null : request.getMessage())) {
            return buildResponse(MODERATION_REPLY, null, Collections.emptyList());
        }

        List<ChatbotKnowledgeDto> knowledgeList = chatbotMapper.selectEnabledKnowledge();
        if (knowledgeList == null || knowledgeList.isEmpty()) {
            return buildResponse(FALLBACK_REPLY, null, Collections.emptyList());
        }

        Map<String, ChatbotDataProvider> providerMap = new HashMap<>();
        for (ChatbotDataProvider provider : dataProviders) {
            if (provider.intentCode() != null) {
                providerMap.put(provider.intentCode(), provider);
            }
        }

        ChatbotMenuMatcher.MenuMatch menuMatch = null;
        try {
            menuMatch = menuMatcher.findBest(normalized);
        } catch (Exception e) {
            log.warn("챗봇 메뉴 검색 실패: {}", e.getMessage());
        }
        ChatbotKnowledgeDto matched = matchKnowledge(normalized, knowledgeList, menuMatch);
        if (matched != null) {
            ChatbotDataProvider provider = providerMap.get(matched.getIntentCode());
            if (provider != null) {
                try {
                    Map<String, String> slots = provider.resolve(normalized);
                    String reply = fillTemplate(matched.getAnswerTemplate(), slots);
                    return buildResponse(reply, matched.getMenuPath(), parseSuggestions(matched.getSuggestions()));
                } catch (Exception e) {
                    log.warn("챗봇 지식 조회 실패: intent={}, message={}", matched.getIntentCode(), e.getMessage());
                }
            }
        }

        return buildResponse(FALLBACK_REPLY, null, collectSuggestions(knowledgeList));
    }

    private String normalize(ChatbotRequest request) {
        if (request == null || request.getMessage() == null) {
            return "";
        }
        String value = request.getMessage().trim();
        if (value.length() > MAX_INPUT_LENGTH) {
            value = value.substring(0, MAX_INPUT_LENGTH);
        }
        return ChatbotTextUtil.normalizeQuery(value);
    }

    private ChatbotKnowledgeDto matchKnowledge(
            String normalized,
            List<ChatbotKnowledgeDto> knowledgeList,
            ChatbotMenuMatcher.MenuMatch menuMatch) {
        ChatbotKnowledgeDto best = null;
        int bestScore = 0;
        for (ChatbotKnowledgeDto knowledge : knowledgeList) {
            if (knowledge.getKeywords() == null) {
                continue;
            }
            int score = menuScore(menuMatch, knowledge) + keywordScore(normalized, knowledge.getKeywords());
            if ("SERMON_SEARCH".equals(knowledge.getIntentCode()) && normalized.contains("설교")) {
                score += 60;
            }
            if (score > bestScore) {
                best = knowledge;
                bestScore = score;
            }
        }
        return best;
    }

    private int menuScore(ChatbotMenuMatcher.MenuMatch menuMatch, ChatbotKnowledgeDto knowledge) {
        return menuMatch != null && menuMatch.path().equals(knowledge.getMenuPath()) ? 100 : 0;
    }

    private int keywordScore(String normalized, String keywords) {
        int score = 0;
        for (String keyword : keywords.split(",")) {
            String normalizedKeyword = ChatbotTextUtil.normalizeQuery(keyword);
            if (!normalizedKeyword.isEmpty() && normalized.contains(normalizedKeyword)) {
                score += normalizedKeyword.length() >= 3 ? 30 : 15;
            }
        }
        return score;
    }

    private String fillTemplate(String template, Map<String, String> slots) {
        if (template == null || template.isEmpty()) {
            return "죄송해요, 답변을 준비 중입니다.";
        }
        if (slots == null) {
            slots = Collections.emptyMap();
        }
        Matcher matcher = SLOT_PATTERN.matcher(template);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            String key = matcher.group(1);
            String value = slots.get(key);
            matcher.appendReplacement(sb, Matcher.quoteReplacement(value == null ? "" : value));
        }
        matcher.appendTail(sb);
        return replaceLegacyNullTokens(sb.toString(), slots).trim();
    }

    private String replaceLegacyNullTokens(String reply, Map<String, String> slots) {
        if (slots == null || slots.isEmpty() || !LEGACY_NULL_PATTERN.matcher(reply).find()) {
            return reply;
        }

        String result = reply;
        for (String value : slots.values()) {
            if (ChatbotTextUtil.isMissingValue(value)) {
                continue;
            }
            result = LEGACY_NULL_PATTERN.matcher(result)
                    .replaceFirst(Matcher.quoteReplacement(value));
        }
        return result;
    }

    private ChatbotResponse buildResponse(String reply, String menuPath, List<String> suggestions) {
        ChatbotResponse response = new ChatbotResponse();
        response.setReply(reply);
        response.setMenuPath(menuPath);
        response.setSuggestions(suggestions);
        return response;
    }

    private List<String> parseSuggestions(String suggestions) {
        if (suggestions == null || suggestions.isBlank()) {
            return Collections.emptyList();
        }
        List<String> result = new ArrayList<>();
        for (String item : suggestions.split(",")) {
            String trimmed = item.trim();
            if (!trimmed.isEmpty()) {
                result.add(trimmed);
            }
        }
        return result;
    }

    private List<String> collectSuggestions(List<ChatbotKnowledgeDto> knowledgeList) {
        List<String> result = new ArrayList<>();
        for (ChatbotKnowledgeDto knowledge : knowledgeList) {
            for (String item : parseSuggestions(knowledge.getSuggestions())) {
                if (!result.contains(item)) {
                    result.add(item);
                    if (result.size() >= MAX_SUGGESTIONS) {
                        return result;
                    }
                }
            }
        }
        return result;
    }
}
