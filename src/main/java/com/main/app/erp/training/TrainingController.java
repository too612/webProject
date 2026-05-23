package com.main.app.erp.training;

import com.main.app.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController("erpTrainingController")
@RequestMapping("/api/erp/training")
@RequiredArgsConstructor
public class TrainingController {

    private final TrainingService trainingService;

    @GetMapping("/course")
    public ApiResponse<Page<TrainingDto.Course>> course(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(trainingService.getCourseList(page, keyword));
    }

    @GetMapping("/student")
    public ApiResponse<Page<TrainingDto.Student>> student(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(trainingService.getStudentList(page, keyword));
    }

    @GetMapping("/attendance")
    public ApiResponse<Page<TrainingDto.Attendance>> attendance(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(trainingService.getAttendanceList(page, keyword));
    }

    @GetMapping("/complete")
    public ApiResponse<Page<TrainingDto.Student>> complete(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(trainingService.getCompleteList(page, keyword));
    }
}
