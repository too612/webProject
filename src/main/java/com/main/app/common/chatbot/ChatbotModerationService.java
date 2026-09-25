package com.main.app.common.chatbot;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

@Service
public class ChatbotModerationService {

    private static final List<String> DEFAULT_BLOCKED_WORDS = List.of("시발", "개새끼");

    private final List<String> blockedWords;

    public ChatbotModerationService(
            @Value("${chatbot.moderation.blocked-words:}") String blockedWords) {
        String configuredWords = blockedWords == null || blockedWords.isBlank()
            || blockedWords.contains("${") ? "" : blockedWords;
        this.blockedWords = Stream.concat(
                DEFAULT_BLOCKED_WORDS.stream(),
                Arrays.stream(configuredWords.split(",")))
            .map(this::normalize)
            .filter(word -> !word.isEmpty())
            .distinct()
            .toList();
    }

    public boolean isBlocked(String message) {
        String normalized = normalize(message);
        return !normalized.isEmpty() && blockedWords.stream().anyMatch(normalized::contains);
    }

    private String normalize(String value) {
        if (value == null) {
            return "";
        }
        return ChatbotTextUtil.normalizeQuery(value);
    }
}