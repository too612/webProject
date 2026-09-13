package com.main.app.common.chatbot;

import java.util.Map;

/**
 * 지식 소스 Provider
 * - intentCode()는 com_chat_knowledge.intent_code와 연결된다.
 * - resolve()는 answer_template의 {{slot}}을 채울 값을 반환한다.
 * - 기존 도메인 서비스를 주입받아 데이터를 조회하므로, 해당 서비스가 DB화되어도 챗봇 코드는 변경되지 않는다.
 */
public interface ChatbotDataProvider {

    String intentCode();

    Map<String, String> resolve(String message);
}
