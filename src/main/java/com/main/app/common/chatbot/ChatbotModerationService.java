package com.main.app.common.chatbot;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

@Service
public class ChatbotModerationService {

    private static final List<String> DEFAULT_BLOCKED_WORDS = List.of(
    // 기본 욕설 및 비하 표현
    "시발", "씨발", "씨팔", "씨블", "개새끼", "소새끼", "소쌍", "지랄", "병신", "븅신",
    "존나", "졸라", "좆나", "좆", "꺼져", "닥쳐", "미친놈", "미친년", "미친새끼", 
    "새끼", "엠창", "애자", "특수부대", "육시랄", "염병", "젠장",

    // 가족/부모 관련 패드립 및 성적 비하
    "느금마", "느긤마", "니기미", "니엄마", "니애미", "애비", "걸레", "창녀", "보지", "자지", "섹스",

    // 초성 및 변형/우회 표현
    "ㅅㅂ", "ㅆㅂ", "ㄱㅅㄲ", "ㅈㄹ", "ㅂㅅ", "ㅈㄴ", "ㅁ친", "시~발", "씨1발", "시발럼", "시발련",

    // 혐오 및 차별적 표현
    "한남", "한녀", "틀딱", "맘충", "급식충", "짱깨", "쪽발이", "쪽바리", "조센징"
    );

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