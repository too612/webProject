package com.main.app.erp.training.student;

import com.main.app.erp.training.student.dto.StudentDto;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class StudentControllerWebMvcTest {

    @Test
    void list_returns_success_response() throws Exception {
        StudentService studentService = mock(StudentService.class);
        StudentController controller = new StudentController(studentService);
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        StudentDto.Student student = new StudentDto.Student();
        student.setStudentId("S001");
        student.setMemberName("홍길동");

        Page<StudentDto.Student> page = new PageImpl<>(List.of(student), PageRequest.of(0, 10), 1);
        when(studentService.getStudentList(eq(0), eq("홍"))).thenReturn(page);

        mockMvc.perform(get("/api/erp/training/student")
                .param("page", "0")
                .param("keyword", "홍"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].studentId").value("S001"));
    }
}
