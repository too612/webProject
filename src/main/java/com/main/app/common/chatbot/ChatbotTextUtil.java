package com.main.app.common.chatbot;

/**
 * 챗봇 텍스트 변환 유틸
 */
public final class ChatbotTextUtil {

    private ChatbotTextUtil() {
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
        return text.replaceAll("[ \\t]*\\n[ \\t]*", "\n")
                .replaceAll("\n{2,}", "\n")
                .trim();
    }
}
