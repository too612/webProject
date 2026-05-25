package com.main.app.mypage.user.inquiry;

import com.main.app.mypage.user.inquiry.dto.InquiryPostDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private static final List<String> INQUIRY_BOARD_TYPES = List.of("QNA");

    private final InquiryMapper inquiryMapper;

    @Transactional(readOnly = true)
    public Map<String, Object> getInquiryList(String userId, int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);
        Pageable pageable = PageRequest.of(safePage, safeSize);

        List<InquiryPostDto> content = inquiryMapper.selectInquiryList(
                userId,
                INQUIRY_BOARD_TYPES,
                (int) pageable.getOffset(),
                pageable.getPageSize());
        long totalElements = inquiryMapper.countInquiryList(userId, INQUIRY_BOARD_TYPES);
        int totalPages = (int) Math.ceil((double) totalElements / pageable.getPageSize());

        return Map.of(
                "content", content,
                "totalElements", totalElements,
                "totalPages", totalPages,
                "number", pageable.getPageNumber(),
                "size", pageable.getPageSize());
    }
}
