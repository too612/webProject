package com.main.app.erp.comm.notice;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.comm.notice.dto.NoticeDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpCommNoticeService")
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeMapper commNoticeMapper;

    public Page<NoticeDto.Notice> getNoticeList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<NoticeDto.Notice> list = commNoticeMapper.selectNoticeList(keyword, offset, limit);
            long total = commNoticeMapper.countNoticeList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
