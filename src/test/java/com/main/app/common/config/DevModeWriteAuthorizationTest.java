package com.main.app.common.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import jakarta.servlet.Filter;
import jakarta.servlet.http.Cookie;

/**
 * dev 편의 모드(app.security.dev-permit-all=true)의 인가 규칙 회귀 테스트.
 * <p>
 * 로컬 개발 편의를 위해 읽기는 열려 있지만, 등록·수정·삭제는 반드시 로그인 세션을 요구해야 한다.
 * (official 게시글·교역자 정보·이미지 등록 API 포함)
 */
@SpringBootTest
class DevModeWriteAuthorizationTest {

    private static final String UNSECURED_READ_PATH = "/api/__security-test__/read";
    private static final String UNSECURED_WRITE_PATH = "/api/__security-test__/write";

    @Autowired
    private WebApplicationContext context;

    @Autowired
    @Qualifier("springSecurityFilterChain")
    private Filter springSecurityFilterChain;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .addFilters(springSecurityFilterChain)
                .build();
    }

    @Test
    void devModeAllowsReadsWithoutSession() throws Exception {
        // 인가를 통과해 핸들러 탐색까지 진행되므로 404 가 응답된다(차단되지 않음).
        mockMvc.perform(get(UNSECURED_READ_PATH)).andExpect(status().isNotFound());
    }

    @Test
    void devModeRejectsWriteWithoutCsrfToken() throws Exception {
        mockMvc.perform(post(UNSECURED_WRITE_PATH))
                .andExpectAll(
                        status().isForbidden(),
                        jsonPath("$.message").value(containsString("요청이 만료되었습니다")));
    }

    @Test
    void devModeRequiresLoginForWrites() throws Exception {
        Cookie csrfCookie = issueCsrfCookie();

        mockMvc.perform(post(UNSECURED_WRITE_PATH)
                .cookie(csrfCookie)
                .header("X-XSRF-TOKEN", csrfCookie.getValue()))
                .andExpectAll(
                        status().isUnauthorized(),
                        jsonPath("$.message").value("로그인이 필요합니다."));
    }

    @Test
    void devModeRequiresLoginForPatchWrites() throws Exception {
        Cookie csrfCookie = issueCsrfCookie();

        mockMvc.perform(patch(UNSECURED_WRITE_PATH)
                .cookie(csrfCookie)
                .header("X-XSRF-TOKEN", csrfCookie.getValue()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void devModeKeepsAuthEndpointsPublicForWrites() throws Exception {
        // 로그인·회원가입 등 /api/auth/** 는 변경 요청이어도 공개되어야 한다(인가 통과 → 404).
        Cookie csrfCookie = issueCsrfCookie();

        mockMvc.perform(post("/api/auth/__security-test__")
                .cookie(csrfCookie)
                .header("X-XSRF-TOKEN", csrfCookie.getValue()))
                .andExpect(status().isNotFound());
    }

    private Cookie issueCsrfCookie() throws Exception {
        Cookie cookie = mockMvc.perform(get("/api/auth/csrf"))
                .andReturn()
                .getResponse()
                .getCookie("XSRF-TOKEN");
        assertThat(cookie).isNotNull();
        return cookie;
    }
}
