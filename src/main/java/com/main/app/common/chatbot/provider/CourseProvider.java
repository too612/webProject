package com.main.app.common.chatbot.provider;

import com.main.app.common.chatbot.ChatbotDataProvider;
import com.main.app.common.chatbot.ChatbotTextUtil;
import com.main.app.official.training.course.CourseService;
import com.main.app.official.training.course.dto.CourseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CourseProvider implements ChatbotDataProvider {

    private final CourseService courseService;

    @Override
    public String intentCode() {
        return "COURSE";
    }

    @Override
    public Map<String, String> resolve(String message) {
        CourseDto course = courseService.getCourse();
        Map<String, String> slots = new LinkedHashMap<>();
        if (course == null) {
            slots.put("course_items", "아직 등록된 양육과정 정보가 없습니다.");
            return slots;
        }
        String title = course.getTitle() == null ? "양육과정" : course.getTitle();
        String content = ChatbotTextUtil.toPlainText(course.getContent());
        slots.put("course_items", title + (content.isBlank() ? "" : "\n" + content));
        return slots;
    }
}