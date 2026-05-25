package com.main.app.erp.sermon.manager;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.sermon.manager.dto.ManagerDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpSermonManagerService")
@RequiredArgsConstructor
public class ManagerService {

    private final ManagerMapper managerMapper;

    public Page<ManagerDto.Worship> getManagerList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<ManagerDto.Worship> list = managerMapper.selectManagerList(keyword, offset, limit);
            long total = managerMapper.countManagerList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
