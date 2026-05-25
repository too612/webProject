package com.main.app.erp.training.student;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.training.student.dto.StudentDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpTrainingStudentService")
@RequiredArgsConstructor
public class StudentService {

    private final StudentMapper studentMapper;

    public Page<StudentDto.Student> getStudentList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<StudentDto.Student> list = studentMapper.selectStudentList(keyword, offset, limit);
            long total = studentMapper.countStudentList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
