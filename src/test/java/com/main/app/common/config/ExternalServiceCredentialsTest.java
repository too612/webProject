package com.main.app.common.config;

import java.io.IOException;
import java.util.Properties;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mock.env.MockEnvironment;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ExternalServiceCredentialsTest {

    @Test
    void credentialsHaveNoHardcodedDefaults() throws IOException {
        assertEquals("${YOUTUBE_API_KEY}", load("application.properties").getProperty("youtube.api-key"));
        assertEquals("${MAIL_PASSWORD}", load("application-dev.properties").getProperty("spring.mail.password"));
        assertEquals("${MAIL_PASSWORD}", load("application-prod.properties").getProperty("spring.mail.password"));
    }

    @Test
    void missingCredentialsCannotResolve() throws IOException {
        MockEnvironment environment = new MockEnvironment();
        assertThrows(IllegalArgumentException.class, () -> environment.resolveRequiredPlaceholders(
                load("application.properties").getProperty("youtube.api-key")));
        for (String profile : new String[] { "dev", "prod" }) {
            assertThrows(IllegalArgumentException.class, () -> environment.resolveRequiredPlaceholders(
                    load("application-" + profile + ".properties").getProperty("spring.mail.password")));
        }
    }

    @Test
    void credentialsResolveFromEnvironment() throws IOException {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("YOUTUBE_API_KEY", "test-youtube-key")
                .withProperty("MAIL_PASSWORD", "test-mail-password");
        assertEquals("test-youtube-key", environment.resolveRequiredPlaceholders(
                load("application.properties").getProperty("youtube.api-key")));
        for (String profile : new String[] { "dev", "prod" }) {
            assertEquals("test-mail-password", environment.resolveRequiredPlaceholders(
                    load("application-" + profile + ".properties").getProperty("spring.mail.password")));
        }
    }

    private static Properties load(String name) throws IOException {
        Properties properties = new Properties();
        try (var input = new ClassPathResource(name).getInputStream()) {
            properties.load(input);
        }
        return properties;
    }
}
