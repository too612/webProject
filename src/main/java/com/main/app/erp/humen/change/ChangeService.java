package com.main.app.erp.humen.change;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.humen.change.dto.ChangeDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpHumenChangeService")
@RequiredArgsConstructor
public class ChangeService {

    private final ChangeMapper changeMapper;

    public Page<ChangeDto.Change> getChangeList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<ChangeDto.Change> list = changeMapper.selectChangeList(keyword, offset, limit);
            long total = changeMapper.countChangeList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
