package com.main.app.common.chatbot;

import java.text.Normalizer;
import java.util.stream.Collectors;

/**
 * 챗봇 텍스트 변환 유틸
 */
public final class ChatbotTextUtil {

    private ChatbotTextUtil() {
    }

    public static String normalizeQuery(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }
        return Normalizer.normalize(value, Normalizer.Form.NFKC)
                .toLowerCase()
                .replaceAll("[\\s\\p{Punct}]+", "");
    }

    public static boolean isMissingValue(String value) {
        return value == null || value.isBlank() || "null".equalsIgnoreCase(value.trim());
    }

    /**
     * HTML(에디터 콘텐츠 등)을 채팅 표시용 순수 텍스트로 변환한다.
     * - &lt;p&gt;, &lt;br&gt;은 줄바꿈으로 치환
     * - 태그 제거 및 주요 엔티티 디코딩
     * - 연속 줄바꿈/공백 정리
     */
    public static String toPlainText(String html) {
        if (html == null || html.isEmpty()) {
            return "";
        }
        String text = html
                .replaceAll("(?i)</p\\s*>", "\n")
                .replaceAll("(?i)<br\\s*/?>", "\n")
                .replaceAll("<[^>]+>", "")
                .replace("&nbsp;", " ")
                .replace("&amp;", "&")
                .replace("&lt;", "<")
                .replace("&gt;", ">")
                .replace("&quot;", "\"");
        return text.lines()
                .map(line -> line == null ? "" : line.trim())
            .filter(line -> !line.isEmpty())
            .collect(Collectors.joining("\n"));
    }
}
