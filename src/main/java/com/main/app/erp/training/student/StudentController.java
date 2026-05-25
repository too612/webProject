package com.main.app.erp.training.student;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.training.student.dto.StudentDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpTrainingStudentController")
@RequestMapping("/api/erp/training/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public ApiResponse<Page<StudentDto.Student>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(studentService.getStudentList(page, keyword));
    }
}
