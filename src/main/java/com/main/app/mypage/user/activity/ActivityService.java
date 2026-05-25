package com.main.app.mypage.user.activity;

import com.main.app.mypage.user.activity.dto.ActivityPostDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityMapper activityMapper;

    @Transactional(readOnly = true)
    public Map<String, Object> getActivityList(String userId, int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);
        Pageable pageable = PageRequest.of(safePage, safeSize);

        java.util.List<ActivityPostDto> content = activityMapper.selectActivityList(
                userId,
                (int) pageable.getOffset(),
                pageable.getPageSize());
        long totalElements = activityMapper.countActivityList(userId);
        int totalPages = (int) Math.ceil((double) totalElements / pageable.getPageSize());

        return Map.of(
                "content", content,
                "totalElements", totalElements,
                "totalPages", totalPages,
                "number", pageable.getPageNumber(),
                "size", pageable.getPageSize());
    }
}
