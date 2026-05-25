package com.main.app.erp.event.apply;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.event.apply.dto.ApplyDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpEventApplyService")
@RequiredArgsConstructor
public class ApplyService {

    private final ApplyMapper applyMapper;

    public Page<ApplyDto.Apply> getApplyList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<ApplyDto.Apply> list = applyMapper.selectApplyList(keyword, offset, limit);
            long total = applyMapper.countApplyList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}