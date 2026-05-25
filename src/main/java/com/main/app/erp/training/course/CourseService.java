package com.main.app.erp.training.course;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.training.course.dto.CourseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpTrainingCourseService")
@RequiredArgsConstructor
public class CourseService {

    private final CourseMapper courseMapper;

    public Page<CourseDto.Course> getCourseList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<CourseDto.Course> list = courseMapper.selectCourseList(keyword, offset, limit);
            long total = courseMapper.countCourseList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
