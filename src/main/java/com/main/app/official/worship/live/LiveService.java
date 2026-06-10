package com.main.app.official.worship.live;

import com.main.app.official.worship.live.dto.LiveDto;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class LiveService {

    private final LiveMapper liveMapper;
    private final RestTemplate restTemplate = new RestTemplate(); // 빈 등록 대신 필드 인스턴스화 (Warning 방지)

    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked") // Unchecked cast 경고 제거
    public List<LiveDto> getLiveItems(String category) {
        try {
            // 1. 유튜브 API 설정
            String apiKey = "AIzaSyAP7K7PLkvWDb1-4fn4fj8dWroqw6Ftr3s";
            String playlistId = "";

            // 카테고리별 재생목록 ID 매핑
            switch (category) {
                case "sunday_evening":
                    playlistId = "PLC_CvPDsdtIU3meLfrT21TKpptIIF4ijp";
                    break;
                case "friday":
                    playlistId = "PLC_CvPDsdtIV8zeL2tKYdJv0TPpWzM6Rw";
                    break;
                default: // sunday_day
                    playlistId = "PLC_CvPDsdtIVIxa3lbU-nnTClQk4fJnF2";
            }

            String url = String.format(
                    "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=%s&key=%s",
                    playlistId, apiKey);
            log.info("[YouTube API] 요청 시도 - playlistId: {}, URL: {}", playlistId, url);

            // 2. 외부 API 호출
            // API 키가 리퍼러 제한(localhost:5173)이 걸려 있으므로 헤더를 수동으로 설정합니다.
            HttpHeaders headers = new HttpHeaders();
            headers.set("Referer", "http://localhost:5173/");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> responseEntity = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            Map<String, Object> response = responseEntity.getBody();
            log.info("[YouTube API] 응답 상태 코드: {}", responseEntity.getStatusCode());

            if (response != null && response.get("items") != null) {
                List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");
                log.info("[YouTube API] 파싱된 아이템 개수: {}", items.size());

                return items.stream()
                        .filter(item -> {
                            Map<String, Object> snippet = (Map<String, Object>) item.get("snippet");
                            if (snippet == null)
                                return false;
                            String title = (String) snippet.get("title");
                            // 비공개(Private video), 삭제된(Deleted video), 또는 특정 비공개 문구 제외
                            return title != null && !"Private video".equalsIgnoreCase(title)
                                    && !"Deleted video".equalsIgnoreCase(title)
                                    && !"This video is private.".equalsIgnoreCase(title);
                        })
                        .map(item -> {
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

                            // 썸네일 안전하게 추출 (high -> standard -> default 순)
                            String thumbUrl = "";
                            if (thumbnails != null) {
                                if (thumbnails.get("high") != null)
                                    thumbUrl = (String) ((Map) thumbnails.get("high")).get("url");
                                else if (thumbnails.get("standard") != null)
                                    thumbUrl = (String) ((Map) thumbnails.get("standard")).get("url");
                                else if (thumbnails.get("default") != null)
                                    thumbUrl = (String) ((Map) thumbnails.get("default")).get("url");
                            }
                            dto.setThumbnailUrl(thumbUrl);

                            if (resourceId != null && resourceId.containsKey("videoId")) {
                                dto.setVideoId((String) resourceId.get("videoId"));
                                dto.setLinkUrl("https://www.youtube.com/watch?v=" + dto.getVideoId());
                            }
                            dto.setCta("영상 시청");
                            return dto;
                        })
                        .limit(10) // 필터링 후 최신순으로 10개만 유지
                        .collect(Collectors.toList());
            }
            log.warn("[YouTube API] 응답에 'items' 데이터가 포함되어 있지 않습니다.");
        } catch (Exception e) {
            log.error("[YouTube API] 연동 중 예외 발생: {}", e.getMessage(), e);
            log.info("[YouTube API] API 실패로 인해 DB(XML) 폴백 데이터를 반환합니다.");
            return liveMapper.selectLiveItems();
        }

        return new ArrayList<>();
    }
}
