package com.main.app.erp.training.complete;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.training.complete.dto.CompleteDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpTrainingCompleteService")
@RequiredArgsConstructor
public class CompleteService {

    private final CompleteMapper completeMapper;

    public Page<CompleteDto.Complete> getCompleteList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<CompleteDto.Complete> list = completeMapper.selectCompleteList(keyword, offset, limit);
            long total = completeMapper.countCompleteList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
