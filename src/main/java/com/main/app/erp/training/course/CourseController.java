package com.main.app.erp.training.course;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.training.course.dto.CourseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpTrainingCourseController")
@RequestMapping("/api/erp/training/course")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ApiResponse<Page<CourseDto.Course>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(courseService.getCourseList(page, keyword));
    }
}
