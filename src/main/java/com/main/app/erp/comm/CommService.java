package com.main.app.erp.comm;

import com.main.app.common.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service("erpCommService")
@RequiredArgsConstructor
public class CommService {

    private final CommMapper commMapper;

    public Page<CommDto.Notice> getNoticeList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<CommDto.Notice> list = commMapper.selectNoticeList(keyword, offset, limit);
        long total = commMapper.countNoticeList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<CommDto.Message> getMessageList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<CommDto.Message> list = commMapper.selectMessageList(keyword, offset, limit);
        long total = commMapper.countMessageList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<CommDto.Prayer> getPrayerList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<CommDto.Prayer> list = commMapper.selectPrayerList(keyword, offset, limit);
        long total = commMapper.countPrayerList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<CommDto.Newsletter> getNewsletterList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<CommDto.Newsletter> list = commMapper.selectNewsletterList(keyword, offset, limit);
        long total = commMapper.countNewsletterList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}
