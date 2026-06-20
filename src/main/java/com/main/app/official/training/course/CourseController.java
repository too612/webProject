package com.main.app.official.training.course;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.training.course.dto.CourseDto;
import com.main.app.official.training.course.dto.CourseRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/official/training/course")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ApiResponse<CourseDto> getCourse() {
        return ApiResponse.ok(courseService.getCourse());
    }

    @PostMapping
    public ApiResponse<Void> createCourse(@RequestBody CourseRequest request) throws Exception {
        courseService.createCourse(request);
        return ApiResponse.ok(null, "양육과정 정보를 등록했습니다.");
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> updateCourse(@PathVariable Long id, @RequestBody CourseRequest request) throws Exception {
        courseService.updateCourse(id, request);
        return ApiResponse.ok(null, "양육과정 정보를 수정했습니다.");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCourse(@PathVariable Long id) throws Exception {
        courseService.deleteCourse(id);
        return ApiResponse.ok(null, "양육과정 정보를 삭제했습니다.");
    }
}