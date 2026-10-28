package com.main.app.common.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import jakarta.servlet.Filter;
import jakarta.servlet.http.Cookie;

/**
 * 인증/인가 회귀 테스트 (운영과 동일한 fail-closed 규칙).
 * <p>
 * app.security.dev-permit-all=false 로 기동해 운영 규칙을 그대로 검증한다.
 * - 비로그인 API 호출 → 401 JSON (리다이렉트 없음)
 * - CSRF 토큰 없는 변경 요청 → 403 JSON
 * - 공개 목록에 없는 경로(로그/빌드 스크립트 등) → 403
 * <p>
 * official 게시글·교역자 정보·이미지 등록도 /api/** 의 변경 요청이므로 이 규칙에 포함된다.
 */
@SpringBootTest(properties = "app.security.dev-permit-all=false")
class SecurityAuthorizationTest {

    private static final String PROTECTED_API = "/api/erp/index";
    private static final String WRITE_API = "/api/common/article/setCreate";

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
    void apiReadWithoutSessionReturnsUnauthorizedJson() throws Exception {
        mockMvc.perform(get(PROTECTED_API))
                .andExpectAll(
                        status().isUnauthorized(),
                        content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                        jsonPath("$.success").value(false),
                        jsonPath("$.statusCode").value(401),
                        jsonPath("$.message").value("로그인이 필요합니다."));
    }

    @Test
    void writeWithoutCsrfTokenIsForbidden() throws Exception {
        mockMvc.perform(post(WRITE_API))
                .andExpectAll(
                        status().isForbidden(),
                        content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                        jsonPath("$.statusCode").value(403),
                        jsonPath("$.message").value(containsString("요청이 만료되었습니다")));
    }

    @Test
    void writeWithCsrfTokenButWithoutSessionIsUnauthorized() throws Exception {
        Cookie csrfCookie = issueCsrfCookie();

        mockMvc.perform(post(WRITE_API)
                .cookie(csrfCookie)
                .header("X-XSRF-TOKEN", csrfCookie.getValue()))
                .andExpectAll(
                        status().isUnauthorized(),
                        jsonPath("$.message").value("로그인이 필요합니다."));
    }

    @Test
    void nonPublicPathsAreDenied() throws Exception {
        // 공개 목록에 없는 경로는 denyAll 대상이며, 익명 요청은 인증 진입점(401)으로 차단된다.
        String[] paths = { "/build.gradle", "/application.properties", "/logs/company-website.log", "/WEB-INF/web.xml" };
        for (String path : paths) {
            mockMvc.perform(get(path))
                    .andExpectAll(
                            status().isUnauthorized(),
                            jsonPath("$.message").value("로그인이 필요합니다."));
        }
    }

    @Test
    void csrfTokenIsIssuedWithoutSession() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/auth/csrf"))
                .andExpectAll(
                        status().isOk(),
                        jsonPath("$.success").value(true),
                        jsonPath("$.data.token").isNotEmpty())
                .andReturn();

        assertThat(result.getResponse().getCookie("XSRF-TOKEN")).isNotNull();
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
