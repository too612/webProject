package com.main.app.common.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
 * 공개 홈페이지(official) 읽기 공개 정책 회귀 테스트 (운영과 동일한 규칙).
 * <p>
 * 비로그인 사용자도 공지·주보·갤러리·교역자·설교·메뉴·첨부를 조회할 수 있어야 하지만,
 * ERP·마이페이지·시스템·커뮤니티와 게시판 작성/답글 폼, 등록·수정·삭제 요청은 계속 로그인이 필요하다.
 */
@SpringBootTest(properties = "app.security.dev-permit-all=false")
class PublicReadAuthorizationTest {

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
    void anonymousCanReadPublicOfficialContent() throws Exception {
        assertNotBlockedForAnonymous("/api/official/news/notice");
        assertNotBlockedForAnonymous("/api/official/index");
        assertNotBlockedForAnonymous("/api/common/article?templateCode=DEFAULT");
        assertNotBlockedForAnonymous("/api/common/comment?pgmId=post&refId=1");
        assertNotBlockedForAnonymous("/api/common/corp/getInfo");
        assertNotBlockedForAnonymous("/api/menu/top?systemType=official");
    }

    @Test
    void anonymousFileListIsEmptyForNonPublicGroup() throws Exception {
        // 비공개 도메인(erp 등)의 파일 목록은 존재 여부를 노출하지 않도록 빈 목록으로 응답한다.
        mockMvc.perform(get("/api/common/files").param("pgmId", "erp").param("refId", "1"))
                .andExpectAll(
                        status().isOk(),
                        jsonPath("$.success").value(true),
                        jsonPath("$.data").isEmpty());
    }

    @Test
    void anonymousCommentListIsEmptyForNonPublicGroup() throws Exception {
        // 비밀글·비공개 도메인의 댓글은 비로그인 사용자에게 빈 목록으로 응답한다.
        mockMvc.perform(get("/api/common/comment").param("pgmId", "erp").param("refId", "1"))
                .andExpectAll(
                        status().isOk(),
                        jsonPath("$.success").value(true),
                        jsonPath("$.data").isEmpty());
    }

    @Test
    void anonymousDownloadOfUnknownFileIsNotFound() throws Exception {
        // 인가를 통과해 공개 판별까지 진행되므로 401 이 아니라 404 로 응답한다.
        mockMvc.perform(get("/api/common/files/999999999/download"))
                .andExpect(status().isNotFound());
    }

    @Test
    void anonymousDownloadZipOfNonPublicGroupIsNotFound() throws Exception {
        mockMvc.perform(get("/api/common/files/downloadZip").param("pgmId", "erp").param("refId", "1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void officialWriteFormsStillRequireSession() throws Exception {
        String[] paths = {
                "/api/official/news/notice/write",
                "/api/official/news/notice/reply?parentNo=1",
                "/api/official/news/bulletin/write",
                "/api/official/nextgen/school/write",
                "/api/official/nextgen/youth/write"
        };
        for (String path : paths) {
            mockMvc.perform(get(path))
                    .andExpectAll(
                            status().isUnauthorized(),
                            jsonPath("$.message").value("로그인이 필요합니다."));
        }
    }

    @Test
    void nonPublicAreasStillRequireSession() throws Exception {
        String[] paths = {
                "/api/erp/index",
                "/api/mypage/index",
                "/api/system/index",
                "/api/community/index",
                "/api/common/popup/employee/context"
        };
        for (String path : paths) {
            mockMvc.perform(get(path))
                    .andExpectAll(
                            status().isUnauthorized(),
                            jsonPath("$.message").value("로그인이 필요합니다."));
        }
    }

    @Test
    void anonymousCommentWriteIsStillRejected() throws Exception {
        Cookie csrfCookie = mockMvc.perform(get("/api/auth/csrf"))
                .andReturn()
                .getResponse()
                .getCookie("XSRF-TOKEN");
        assertThat(csrfCookie).isNotNull();

        mockMvc.perform(post("/api/common/comment/save")
                .cookie(csrfCookie)
                .header("X-XSRF-TOKEN", csrfCookie.getValue())
                .contentType("application/json")
                .content("{\"pgmId\":\"post\",\"refId\":\"1\",\"writer\":\"anon\",\"content\":\"test\"}"))
                .andExpectAll(
                        status().isUnauthorized(),
                        jsonPath("$.message").value("로그인이 필요합니다."));
    }

    /**
     * 인가 단계에서 차단(401)되지 않았는지만 확인한다.
     * <p>
     * 공개 조회는 DB 조회 결과에 따라 응답 코드가 달라지므로(200/빈 목록 등) 401 이 아님을 검증한다.
     */
    private void assertNotBlockedForAnonymous(String path) throws Exception {
        int status = mockMvc.perform(get(path))
                .andReturn()
                .getResponse()
                .getStatus();
        assertThat(status)
                .as("비로그인 공개 조회가 차단되었습니다: %s", path)
                .isNotEqualTo(401);
    }
}
