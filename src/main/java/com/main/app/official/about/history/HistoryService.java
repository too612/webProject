package com.main.app.official.about.history;

import com.main.app.common.attachment.AttachmentService;
import com.main.app.official.about.history.dto.HistoryDto;
import com.main.app.official.about.history.dto.HistoryEventDto;
import com.main.app.official.about.history.dto.HistoryRequest;
import com.main.app.official.about.history.dto.HistoryYearDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryMapper historyMapper;
    private final AttachmentService attachmentService;

    @Transactional(readOnly = true)
    public HistoryDto getHistory() {
        HistoryDto dto = new HistoryDto();

        List<HistoryYearDto> years = historyMapper.selectHistoryYears();
        if (years == null || years.isEmpty()) {
            dto.setTimeline(Collections.emptyList());
            return dto;
        }

        List<HistoryEventDto> events = historyMapper.selectHistoryEvents();
        Map<Long, List<HistoryEventDto>> eventMap = new HashMap<>();
        if (events != null) {
            for (HistoryEventDto event : events) {
                eventMap.computeIfAbsent(event.getHistoryId(), k -> new ArrayList<>()).add(event);
            }
        }

        List<HistoryDto.TimelineItem> timeline = new ArrayList<>();
        for (HistoryYearDto year : years) {
            HistoryDto.TimelineItem item = new HistoryDto.TimelineItem();
            item.setYear(year.getYearLabel());
            List<HistoryDto.EventItem> eventItems = new ArrayList<>();
            List<HistoryEventDto> yearEvents =
                    eventMap.getOrDefault(year.getHistoryId(), Collections.emptyList());
            for (HistoryEventDto event : yearEvents) {
                List<String> rawImages = parseImages(event.getImages());
                HistoryDto.EventItem eventItem = new HistoryDto.EventItem();
                eventItem.setDate(event.getEventDate());
                eventItem.setDescription(event.getDescription());
                eventItem.setImages(resolveImageUrls(rawImages));
                eventItem.setImageIds(resolveImageIds(rawImages));
                eventItems.add(eventItem);
            }
            item.setEvents(eventItems);
            timeline.add(item);
        }
        dto.setTimeline(timeline);
        return dto;
    }

    private List<String> parseImages(String imagesJson) {
        if (imagesJson == null || imagesJson.isBlank()) {
            return Collections.emptyList();
        }
        String json = imagesJson.trim();
        if (json.startsWith("[") && json.endsWith("]")) {
            json = json.substring(1, json.length() - 1);
        }
        List<String> images = new ArrayList<>();
        for (String part : json.split(",")) {
            String trimmed = part.trim().replace("\"", "");
            if (!trimmed.isEmpty()) {
                images.add(trimmed);
            }
        }
        return images;
    }

    /**
     * 연혁 전체 저장 (연도/이벤트 전체 교체)
     * - 연도·이벤트는 전체 삭제 후 재등록
     * - 더 이상 참조되지 않는 첨부 이미지는 소프트 삭제
     */
    @Transactional
    public void setCreate(HistoryRequest request) {
        saveInternal(request);
    }

    @Transactional
    public void setUpdate(HistoryRequest request) {
        saveInternal(request);
    }

    private void saveInternal(HistoryRequest request) {
        // 1. 기존 연혁이 갖고 있던 이미지 fileId 수집 (교체 후 참조가 사라진 파일 정리용)
        Set<String> oldImageIds = collectAllImageIds();

        // 2. 연도·이벤트 전체 교체
        historyMapper.deleteAllYears();
        insertTimeline(request.getTimeline());

        // 3. 더 이상 참조되지 않는 이미지 + 명시 삭제 이미지 소프트 삭제
        Set<String> newImageIds = collectRequestImageIds(request);
        oldImageIds.removeAll(newImageIds);
        for (String fileId : oldImageIds) {
            softDeleteFileQuietly(fileId);
        }
        if (request.getDeletedFileIds() != null) {
            for (Long fileId : request.getDeletedFileIds()) {
                softDeleteFileQuietly(String.valueOf(fileId));
            }
        }
    }

    @Transactional
    public void delRemove() {
        for (String fileId : collectAllImageIds()) {
            softDeleteFileQuietly(fileId);
        }
        historyMapper.deleteAllYears();
    }

    // =====================================================================
    // 내부 유틸
    // =====================================================================

    private void insertTimeline(List<HistoryRequest.YearItem> timeline) {
        if (timeline == null || timeline.isEmpty()) {
            return;
        }
        int yearOrder = 0;
        for (HistoryRequest.YearItem yearItem : timeline) {
            if (yearItem.getYear() == null || yearItem.getYear().isBlank()) {
                continue;
            }
            Integer yearNo = parseYear(yearItem.getYear());
            if (yearNo == null) {
                continue;
            }
            HistoryYearDto year = new HistoryYearDto();
            year.setYearLabel(yearItem.getYear());
            year.setYearNo(yearNo);
            year.setSortOrder(++yearOrder);
            historyMapper.insertYear(year);

            Long historyId = year.getHistoryId();
            if (historyId == null || yearItem.getEvents() == null) {
                continue;
            }
            int eventOrder = 0;
            for (HistoryRequest.EventItem eventItem : yearItem.getEvents()) {
                if (eventItem.getDate() == null || eventItem.getDescription() == null) {
                    continue;
                }
                historyMapper.insertEvent(historyId, eventItem.getDate(), eventItem.getDescription(),
                        toJsonArray(eventItem.getImages()), ++eventOrder);
            }
        }
    }

    private Set<String> collectAllImageIds() {
        Set<String> ids = new HashSet<>();
        List<HistoryEventDto> events = historyMapper.selectHistoryEvents();
        if (events != null) {
            for (HistoryEventDto event : events) {
                ids.addAll(resolveImageIds(parseImages(event.getImages())));
            }
        }
        return ids;
    }

    private Set<String> collectRequestImageIds(HistoryRequest request) {
        Set<String> ids = new HashSet<>();
        if (request.getTimeline() != null) {
            for (HistoryRequest.YearItem yearItem : request.getTimeline()) {
                if (yearItem.getEvents() == null) {
                    continue;
                }
                for (HistoryRequest.EventItem eventItem : yearItem.getEvents()) {
                    ids.addAll(resolveImageIds(eventItem.getImages()));
                }
            }
        }
        return ids;
    }

    private void softDeleteFileQuietly(String fileId) {
        try {
            attachmentService.softDeleteFile(Long.parseLong(fileId));
        } catch (Exception ignored) {
            // 파일이 이미 삭제됐거나 존재하지 않는 경우 무시
        }
    }

    /** fileId(숫자) → 다운로드 URL, 그 외(레거시 경로)는 원본 유지 */
    private List<String> resolveImageUrls(List<String> rawImages) {
        List<String> urls = new ArrayList<>();
        for (String value : rawImages) {
            if (value == null || value.isBlank()) {
                continue;
            }
            if (value.matches("\\d+")) {
                urls.add("/api/common/files/" + value + "/download");
            } else {
                urls.add(value);
            }
        }
        return urls;
    }

    /** 숫자(fileId) 항목만 추출 (편집 화면에서 기존 첨부 표시용) */
    private List<String> resolveImageIds(List<String> rawImages) {
        List<String> ids = new ArrayList<>();
        for (String value : rawImages) {
            if (value != null && value.matches("\\d+")) {
                ids.add(value);
            }
        }
        return ids;
    }

    private String toJsonArray(List<String> values) {
        if (values == null || values.isEmpty()) {
            return "[]";
        }
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < values.size(); i++) {
            if (i > 0) {
                sb.append(",");
            }
            String value = values.get(i) == null ? "" : values.get(i);
            sb.append("\"").append(value.replace("\\", "\\\\").replace("\"", "\\\"")).append("\"");
        }
        sb.append("]");
        return sb.toString();
    }

    private Integer parseYear(String yearLabel) {
        String digits = yearLabel.replaceAll("[^0-9]", "");
        if (digits.isEmpty()) {
            return null;
        }
        try {
            String first4 = digits.substring(0, Math.min(4, digits.length()));
            int year = Integer.parseInt(first4);
            return year >= 1900 && year <= 3000 ? year : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
