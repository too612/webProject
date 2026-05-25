package com.main.app.erp.account.input;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.account.input.dto.InputDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InputService {

    private final InputMapper accountInputMapper;

    public Page<InputDto.Offering> getInputList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<InputDto.Offering> list = accountInputMapper.selectInputList(keyword, offset, limit);
            long total = accountInputMapper.countInputList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
