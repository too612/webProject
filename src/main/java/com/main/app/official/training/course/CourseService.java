package com.main.app.official.training.course;

import com.main.app.official.training.course.dto.CourseDto;
import com.main.app.official.training.course.dto.CourseRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseMapper courseMapper;

    @Transactional(readOnly = true)
    public CourseDto getCourse() {
        return courseMapper.selectCourse();
    }

    @Transactional
    public void createCourse(CourseRequest request) throws Exception {
        int result = courseMapper.insertCourse(request);
        if (result != 1) {
            throw new Exception("양육과정 정보 등록에 실패했습니다.");
        }
    }

    @Transactional
    public void updateCourse(Long id, CourseRequest request) throws Exception {
        int result = courseMapper.updateCourse(id, request);
        if (result != 1) {
            throw new Exception("양육과정 정보 수정에 실패했습니다.");
        }
    }

    @Transactional
    public void deleteCourse(Long id) throws Exception {
        int result = courseMapper.deleteCourse(id);
        if (result != 1) {
            throw new Exception("양육과정 정보 삭제에 실패했습니다.");
        }
    }
}