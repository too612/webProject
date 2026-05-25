package com.main.app.erp.event.result;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.event.result.dto.ResultDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpEventResultService")
@RequiredArgsConstructor
public class ResultService {

    private final ResultMapper resultMapper;

    public Page<ResultDto.Event> getResultList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<ResultDto.Event> list = resultMapper.selectResultList(keyword, offset, limit);
            long total = resultMapper.countResultList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}