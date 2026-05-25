package com.main.app.erp.ministry.department;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.ministry.department.dto.DepartmentDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpMinistryDepartmentService")
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentMapper departmentMapper;

    public Page<DepartmentDto.Department> getDepartmentList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<DepartmentDto.Department> list = departmentMapper.selectDepartmentList(keyword, offset, limit);
            long total = departmentMapper.countDepartmentList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
