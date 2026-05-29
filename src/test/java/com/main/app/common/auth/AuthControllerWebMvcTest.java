package com.main.app.common.auth;

import com.main.app.common.auth.dto.UserDto;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthControllerWebMvcTest {

    @Test
    void login_returns_success_response() throws Exception {
        UserService userService = mock(UserService.class);
        AuthController controller = new AuthController(userService);
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        UserDto user = new UserDto();
        user.setUserId("test-user");
        user.setUserName("테스터");
        user.setStatus("A");

        when(userService.login("test-user", "password123")).thenReturn(user);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "username": "test-user",
                          "password": "password123",
                          "rememberMe": false
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.userId").value("test-user"));
    }
}
