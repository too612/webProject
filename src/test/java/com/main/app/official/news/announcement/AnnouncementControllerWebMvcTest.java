package com.main.app.official.news.announcement;

import com.main.app.official.news.announcement.dto.AnnouncementDto;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AnnouncementControllerWebMvcTest {

    @Test
    void list_returns_success_response() throws Exception {
        AnnouncementService announcementService = mock(AnnouncementService.class);
        AnnouncementController controller = new AnnouncementController(announcementService);
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        AnnouncementDto dto = new AnnouncementDto();
        dto.setTitle("공지 테스트");

        Page<AnnouncementDto> page = new PageImpl<>(List.of(dto), PageRequest.of(0, 10), 1);
        when(announcementService.getBoardList(any(), anyString(), anyString())).thenReturn(page);

        mockMvc.perform(get("/api/official/news/announcement")
                .param("page", "0")
                .param("searchType", "title")
                .param("keyword", "공지"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].title").value("공지 테스트"));
    }
}
