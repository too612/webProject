package com.main.app.official.worship.live;

import com.main.app.official.worship.live.dto.LiveDto;
import com.main.app.official.worship.live.dto.LiveStreamStatusDto;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class LiveService {

    private static final String YOUTUBE_ITEMS_URL =
            "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=%s&key=%s";
    private static final String YOUTUBE_LIVE_SEARCH_URL =
            "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=%s&eventType=live&type=video&maxResults=1&key=%s";
    private static final int MAX_LIVE_ITEMS = 10;
    private static final String[] THUMBNAIL_PRIORITY = { "high", "standard", "default" };

    private final LiveMapper liveMapper;
    private final RestTemplate restTemplate = new RestTemplate(); // 빈 등록 대신 필드 인스턴스화 (Warning 방지)

    @Value("${youtube.api-key:}")
    private String youtubeApiKey;

    @Value("${youtube.channel-id:}")
    private String youtubeChannelId;

    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked") // Unchecked cast 경고 제거
    public List<LiveDto> getLiveItems(String category) {
        // API 키가 설정되지 않았으면 DB(XML) 폴백 데이터를 바로 반환한다.
        if (youtubeApiKey.isBlank()) {
            return liveMapper.selectLiveItems();
        }

        try {
            String url = String.format(YOUTUBE_ITEMS_URL, resolvePlaylistId(category), youtubeApiKey);
            log.info("[YouTube API] 요청 시도 - URL: {}", url);

            // 2. 외부 API 호출
            // API 키가 리퍼러 제한(localhost:5173)이 걸려 있으므로 헤더를 수동으로 설정합니다.
            HttpHeaders headers = new HttpHeaders();
            headers.set("Referer", "http://localhost:5173/");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ParameterizedTypeReference<Map<String, Object>> typeReference =
                    new ParameterizedTypeReference<>() {
                    };
            ResponseEntity<Map<String, Object>> responseEntity =
                    restTemplate.exchange(url, HttpMethod.GET, entity, typeReference);
            Map<String, Object> response = responseEntity.getBody();
            log.info("[YouTube API] 응답 상태 코드: {}", responseEntity.getStatusCode());

            if (response == null || response.get("items") == null) {
                log.warn("[YouTube API] 응답에 'items' 데이터가 포함되어 있지 않습니다.");
                return new ArrayList<>();
            }

            List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");
            log.info("[YouTube API] 파싱된 아이템 개수: {}", items.size());

            return items.stream()
                    .filter(LiveService::isPublicVideo)
                    .map(LiveService::toLiveDto)
                    .limit(MAX_LIVE_ITEMS) // 필터링 후 최신순으로 10개만 유지
                    .toList();
        } catch (Exception e) {
            log.error("[YouTube API] 연동 중 예외 발생: {}", e.getMessage(), e);
            log.info("[YouTube API] API 실패로 인해 DB(XML) 폴백 데이터를 반환합니다.");
            return liveMapper.selectLiveItems();
        }
    }

    /**
     * 현재 실시간 라이브 방송 상태를 조회한다.
     * <p>
     * YouTube Data API {@code search?eventType=live&channelId=...} 로 현재 진행 중인
     * 라이브 영상 ID를 해석한다. 방송 중이 아니면 {@code live=false} 이고,
     * API 호출 자체가 실패(키/네트워크 문제)하면 {@code available=false} 를 반환해
     * 프론트엔드가 기존 {@code live_stream?channel=} embed 방식으로 폴백하게 한다.
     */
    @SuppressWarnings("unchecked")
    public LiveStreamStatusDto getLiveStreamStatus() {
        LiveStreamStatusDto status = new LiveStreamStatusDto();
        status.setLive(false);
        status.setAvailable(false);
        status.setChannelUrl("https://www.youtube.com/channel/" + youtubeChannelId);

        // API 키 또는 채널 ID가 설정되지 않았으면 라이브 여부를 확인할 수 없다.
        if (youtubeApiKey.isBlank() || youtubeChannelId.isBlank()) {
            log.info("[YouTube API] 라이브 조회 설정 부족 - apiKey={}, channelId={}",
                    youtubeApiKey.isBlank() ? "미설정" : "설정됨",
                    youtubeChannelId.isBlank() ? "미설정" : "설정됨");
            return status;
        }

        try {
            String url = String.format(YOUTUBE_LIVE_SEARCH_URL, youtubeChannelId, youtubeApiKey);
            log.info("[YouTube API] 라이브 방송 상태 조회 - URL: {}", url);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Referer", "http://localhost:5173/");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ParameterizedTypeReference<Map<String, Object>> typeReference =
                    new ParameterizedTypeReference<>() {
                    };
            ResponseEntity<Map<String, Object>> responseEntity =
                    restTemplate.exchange(url, HttpMethod.GET, entity, typeReference);
            Map<String, Object> response = responseEntity.getBody();

            // 응답을 정상 수신했으므로 라이브 여부를 확인했다.
            status.setAvailable(true);

            if (response != null && response.get("items") != null) {
                List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");
                if (!items.isEmpty()) {
                    Map<String, Object> item = items.get(0);
                    Map<String, Object> id = (Map<String, Object>) item.get("id");
                    Map<String, Object> snippet = (Map<String, Object>) item.get("snippet");

                    status.setLive(true);
                    if (id != null) {
                        status.setVideoId((String) id.get("videoId"));
                    }
                    if (snippet != null) {
                        status.setTitle((String) snippet.get("title"));
                    }
                }
            }
            log.info("[YouTube API] 라이브 방송 상태 조회 완료 - live={}, videoId={}",
                    status.isLive(), status.getVideoId());
        } catch (Exception e) {
            status.setAvailable(false);
            log.warn("[YouTube API] 라이브 방송 상태 조회 실패 - {}", e.getMessage());
        }
        return status;
    }

    /**
     * 카테고리별 재생목록 ID 매핑
     */
    private static String resolvePlaylistId(String category) {
        if ("sunday_evening".equals(category)) {
            return "PLC_CvPDsdtIU3meLfrT21TKpptIIF4ijp";
        }
        if ("wednesday".equals(category)) {
            return "PLC_CvPDsdtIUDVdT443IlBkvkmXvLAUXc";
        }
        if ("friday".equals(category)) {
            return "PLC_CvPDsdtIV8zeL2tKYdJv0TPpWzM6Rw";
        }
        return "PLC_CvPDsdtIVIxa3lbU-nnTClQk4fJnF2"; // sunday_day
    }

    /**
     * 비공개(Private video), 삭제된(Deleted video) 영상 제외
     */
    private static boolean isPublicVideo(Map<String, Object> item) {
        Map<String, Object> snippet = (Map<String, Object>) item.get("snippet");
        if (snippet == null) {
            return false;
        }
        String title = (String) snippet.get("title");
        return title != null
                && !"Private video".equalsIgnoreCase(title)
                && !"Deleted video".equalsIgnoreCase(title)
                && !"This video is private.".equalsIgnoreCase(title);
    }

    private static LiveDto toLiveDto(Map<String, Object> item) {
        Map<String, Object> snippet = (Map<String, Object>) item.get("snippet");
        Map<String, Object> thumbnails = snippet != null
                ? (Map<String, Object>) snippet.get("thumbnails")
                : null;
        Map<String, Object> resourceId = snippet != null
                ? (Map<String, Object>) snippet.get("resourceId")
                : null;

        LiveDto dto = new LiveDto();
        dto.setTabType("videos");
        dto.setTitle(
                snippet != null ? String.valueOf(snippet.getOrDefault("title", "제목 없음")) : "제목 없음");
        dto.setDescription(
                snippet != null ? String.valueOf(snippet.getOrDefault("description", "")) : "");
        dto.setThumbnailUrl(extractThumbnailUrl(thumbnails));

        if (resourceId != null && resourceId.containsKey("videoId")) {
            dto.setVideoId((String) resourceId.get("videoId"));
            dto.setLinkUrl("https://www.youtube.com/watch?v=" + dto.getVideoId());
        }
        dto.setCta("영상 시청");
        return dto;
    }

    /**
     * 썸네일 안전하게 추출 (high -> standard -> default 순)
     */
    private static String extractThumbnailUrl(Map<String, Object> thumbnails) {
        if (thumbnails == null) {
            return "";
        }
        for (String key : THUMBNAIL_PRIORITY) {
            String url = thumbnailUrlOf(thumbnails, key);
            if (url != null) {
                return url;
            }
        }
        return "";
    }

    private static String thumbnailUrlOf(Map<String, Object> thumbnails, String key) {
        Object thumbnail = thumbnails.get(key);
        return thumbnail instanceof Map
                ? (String) ((Map<?, ?>) thumbnail).get("url")
                : null;
    }
}
