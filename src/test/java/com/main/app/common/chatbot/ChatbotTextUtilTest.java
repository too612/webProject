package com.main.app.common.chatbot;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ChatbotTextUtilTest {

    @Test
    void normalizeQueryRemovesSpacingAndPunctuation() {
        assertEquals("예배시간", ChatbotTextUtil.normalizeQuery(" 예배 시간? "));
    }

    @Test
    void normalizeQuerySupportsCompatibilityCharacters() {
        assertEquals("5시예배", ChatbotTextUtil.normalizeQuery("５시 예배"));
    }
}