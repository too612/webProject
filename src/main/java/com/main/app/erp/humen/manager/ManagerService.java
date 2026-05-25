package com.main.app.erp.humen.manager;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.humen.manager.dto.ManagerDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpHumenManagerService")
@RequiredArgsConstructor
public class ManagerService {

    private final ManagerMapper managerMapper;

    public Page<ManagerDto.Member> getMemberList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<ManagerDto.Member> list = managerMapper.selectMemberList(keyword, offset, limit);
            long total = managerMapper.countMemberList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
