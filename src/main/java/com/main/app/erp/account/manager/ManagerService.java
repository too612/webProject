package com.main.app.erp.account.manager;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.account.manager.dto.ManagerDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ManagerService {

    private final ManagerMapper accountManagerMapper;

    public Page<ManagerDto.Offering> getOfferingList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<ManagerDto.Offering> list = accountManagerMapper.selectOfferingList(keyword, offset, limit);
            long total = accountManagerMapper.countOfferingList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
