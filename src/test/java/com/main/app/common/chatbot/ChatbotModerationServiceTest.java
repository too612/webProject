package com.main.app.common.chatbot;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ChatbotModerationServiceTest {

    private final ChatbotModerationService moderationService =
            new ChatbotModerationService("시발,개새끼");

    @Test
    void blocksConfiguredProfanity() {
        assertTrue(moderationService.isBlocked("시 발"));
        assertTrue(moderationService.isBlocked("개-새끼"));
    }

    @Test
    void allowsNormalQuestion() {
        assertFalse(moderationService.isBlocked("예배시간 알려줘"));
    }
}