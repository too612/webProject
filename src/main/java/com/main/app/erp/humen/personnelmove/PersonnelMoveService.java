package com.main.app.erp.humen.personnelmove;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.humen.personnelmove.dto.PersonnelMoveDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpHumenPersonnelMoveService")
@RequiredArgsConstructor
public class PersonnelMoveService {

    private final PersonnelMoveMapper personnelMoveMapper;

    public Page<PersonnelMoveDto.PersonnelMove> getPersonnelMoveList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<PersonnelMoveDto.PersonnelMove> list = personnelMoveMapper.selectPersonnelMoveList(keyword, offset, limit);
            long total = personnelMoveMapper.countPersonnelMoveList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
