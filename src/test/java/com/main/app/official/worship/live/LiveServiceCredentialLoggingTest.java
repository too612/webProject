package com.main.app.official.worship.live;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(OutputCaptureExtension.class)
class LiveServiceCredentialLoggingTest {

    private static final String TEST_KEY = "test-key-must-not-appear-in-logs";

    @Test
    void successfulRequestsDoNotLogCredentials(CapturedOutput output) {
        LiveMapper mapper = mock(LiveMapper.class);
        RestTemplate client = mock(RestTemplate.class);
        LiveService service = service(mapper, client);
        when(client.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class),
                org.mockito.ArgumentMatchers.<ParameterizedTypeReference<Map<String, Object>>>any()))
                .thenReturn(ResponseEntity.ok(Map.<String, Object>of("items", List.of())));

        assertTrue(service.getLiveItems("sunday_evening").isEmpty());
        assertTrue(service.getLiveStreamStatus().isAvailable());
        assertFalse(output.getAll().contains(TEST_KEY));
        assertTrue(output.getAll().contains("[YouTube API]"));
    }

    @Test
    void exceptionUrlsDoNotLeakAndFallbackIsPreserved(CapturedOutput output) {
        LiveMapper mapper = mock(LiveMapper.class);
        RestTemplate client = mock(RestTemplate.class);
        LiveService service = service(mapper, client);
        when(mapper.selectLiveItems()).thenReturn(List.of());
        when(client.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class),
                org.mockito.ArgumentMatchers.<ParameterizedTypeReference<Map<String, Object>>>any()))
                .thenThrow(new IllegalStateException("Request failed: https://example.invalid/?key=" + TEST_KEY));

        assertTrue(service.getLiveItems("sunday_evening").isEmpty());
        verify(mapper).selectLiveItems();
        assertFalse(service.getLiveStreamStatus().isAvailable());
        assertFalse(output.getAll().contains(TEST_KEY));
        assertTrue(output.getAll().contains("IllegalStateException"));
    }

    private static LiveService service(LiveMapper mapper, RestTemplate client) {
        LiveService service = new LiveService(mapper);
        ReflectionTestUtils.setField(service, "restTemplate", client);
        ReflectionTestUtils.setField(service, "youtubeApiKey", TEST_KEY);
        ReflectionTestUtils.setField(service, "youtubeChannelId", "test-channel");
        return service;
    }
}
