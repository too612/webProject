package com.main.app.erp.comm.newsletter;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.comm.newsletter.dto.NewsletterDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpCommNewsletterService")
@RequiredArgsConstructor
public class NewsletterService {

    private final NewsletterMapper newsletterMapper;

    public Page<NewsletterDto.Newsletter> getNewsletterList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<NewsletterDto.Newsletter> list = newsletterMapper.selectNewsletterList(keyword, offset, limit);
            long total = newsletterMapper.countNewsletterList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
