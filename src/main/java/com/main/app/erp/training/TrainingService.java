package com.main.app.erp.training;

import com.main.app.common.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service("erpTrainingService")
@RequiredArgsConstructor
public class TrainingService {

    private final TrainingMapper trainingMapper;

    public Page<TrainingDto.Course> getCourseList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<TrainingDto.Course> list = trainingMapper.selectCourseList(keyword, offset, limit);
        long total = trainingMapper.countCourseList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<TrainingDto.Student> getStudentList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<TrainingDto.Student> list = trainingMapper.selectStudentList(keyword, offset, limit);
        long total = trainingMapper.countStudentList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<TrainingDto.Attendance> getAttendanceList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<TrainingDto.Attendance> list = trainingMapper.selectAttendanceList(keyword, offset, limit);
        long total = trainingMapper.countAttendanceList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<TrainingDto.Student> getCompleteList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<TrainingDto.Student> list = trainingMapper.selectCompleteList(keyword, offset, limit);
        long total = trainingMapper.countCompleteList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}
