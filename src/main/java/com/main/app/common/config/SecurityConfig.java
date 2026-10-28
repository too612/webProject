package com.main.app.common.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.csrf.InvalidCsrfTokenException;
import org.springframework.security.web.csrf.MissingCsrfTokenException;

import tools.jackson.databind.ObjectMapper;
import com.main.app.common.auth.UserMapper;
import com.main.app.common.auth.dto.UserDto;
import com.main.app.common.dto.ApiResponse;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * 인증 없이 접근 가능한 경로.
     * - 정적/에러 경로: SPA 진입점
     * - /api/auth/**: 로그인·로그아웃·세션 확인·CSRF 토큰 발급
     * - /api/common/chatbot/**: 공개 챗봇
     * - /data/**: 공개 사이트(교역자 소개 등)에서 사용하는 업로드 이미지.
     *   StaticResourceConfig 가 이미지 확장자만 노출하도록 제한한다.
     */
    private static final String[] PUBLIC_PATHS = {
            "/",
            "/index.html",
            "/assets/**",
            "/img/**",
            "/favicon.ico",
            "/error",
            "/api/auth/**",
            "/api/common/chatbot/**",
            "/data/**"
    };

    /**
     * 데이터를 변경하는 요청 메서드.
     * <p>
     * dev 편의 모드(app.security.dev-permit-all=true)에서 읽기는 열어 두더라도, 등록·수정·삭제는
     * 반드시 로그인 세션을 요구한다. official(교역자 정보·게시글·이미지 등)의 등록 API 도 같은 규칙을 따른다.
     */
    private static final List<HttpMethod> WRITE_METHODS = List.of(
            HttpMethod.POST, HttpMethod.PUT, HttpMethod.PATCH, HttpMethod.DELETE);

    /**
     * 비로그인 사용자에게 공개하는 조회(GET) 경로 — 공개 홈페이지(official) 렌더링에 필요한 최소 집합.
     * <p>
     * - /api/official/**: 공지·주보·갤러리·교역자·연혁·설교 등 공개 콘텐츠 조회
     * - /api/common/article/**: official 게시판이 공용으로 사용하는 게시글 조회(비밀글은 서버가 비밀번호 검증)
     * - /api/common/files/**: 첨부 다운로드·파일 목록.
     *   파일 ID 열거로 비공개 첨부가 내려가지 않도록 AttachmentController 가
     *   {@link com.main.app.common.attachment.PublicContentAccessGuard} 로 공개 도메인/비밀글 여부를 확인한다.
     * - /api/common/comment/**: 댓글 조회(등록·추천은 POST 이므로 인증 필요). 비공개 그룹은 빈 목록으로 응답한다.
     * - /api/common/corp/getInfo: 공개 사이트 헤더·푸터·오시는 길에 표기하는 교회 정보
     * - /api/menu/**: 공개 사이트 헤더·브레드크럼용 메뉴 트리
     * <p>
     * ERP·마이페이지·시스템·커뮤니티(성도/가족/그룹)·인사 팝업은 공개하지 않는다.
     */
    private static final String[] PUBLIC_READ_PATHS = {
            "/api/official/**",
            "/api/common/article",
            "/api/common/article/**",
            "/api/common/files",
            "/api/common/files/**",
            "/api/common/comment",
            "/api/common/comment/**",
            "/api/common/corp/getInfo",
            "/api/menu/**"
    };

    /**
     * 공개 사이트에서도 로그인을 요구하는 official 조회 경로.
     * <p>
     * 작성/답글 폼은 게시글 원본(비밀번호 포함)을 그대로 반환하므로 공개 조회 대상에서 제외한다.
     * 해당 화면은 프론트엔드에서도 ProtectedRoute 로 보호된다.
     * (Spring Security 7 의 경로 매처는 {@code **} 를 중간에 쓸 수 없어 엔드포인트를 명시한다.)
     */
    private static final String[] OFFICIAL_FORM_PATHS = {
            "/api/official/news/notice/write",
            "/api/official/news/notice/reply",
            "/api/official/news/bulletin/write",
            "/api/official/news/bulletin/reply",
            "/api/official/nextgen/school/write",
            "/api/official/nextgen/school/reply",
            "/api/official/nextgen/youth/write",
            "/api/official/nextgen/youth/reply"
    };

    private final Environment environment;

    public SecurityConfig(Environment environment) {
        this.environment = environment;
    }

    /**
     * BCrypt 비밀번호 인코더 Bean 등록
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 실제 사용자 테이블을 인증 소스로 등록한다.
     * <p>
     * 현재 인증은 {@link SessionAuthenticationFilter} 가 세션 기반으로 처리하므로 이 빈으로 인증을 수행하지는 않지만,
     * Spring Boot 가 자동 생성하는 in-memory 기본 사용자(기동 로그에 비밀번호가 출력되는 계정)를 제거하는 역할을 한다.
     */
    @Bean
    public UserDetailsService userDetailsService(UserMapper userMapper) {
        return userId -> {
            UserDto user = userMapper.selectUserByUserId(userId);
            if (user == null || user.getPassword() == null || user.getPassword().isBlank()) {
                throw new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
            }
            return User.withUsername(user.getUserId())
                    .password(user.getPassword())
                    .authorities(List.<GrantedAuthority>of())
                    .disabled(!"A".equals(user.getStatus()))
                    .build();
        };
    }

    /**
     * CSRF 토큰 저장소.
     * axios(SPA)가 쿠키를 읽어 헤더로 전송할 수 있도록 HttpOnly 를 해제하고, 경로를 루트로 고정한다.
     */
    @Bean
    public CsrfTokenRepository csrfTokenRepository() {
        CookieCsrfTokenRepository repository = CookieCsrfTokenRepository.withHttpOnlyFalse();
        repository.setCookiePath("/");
        return repository;
    }

    /**
     * Spring Security 설정
     * - dev: app.security.dev-permit-all=true 인 경우에만 읽기 전체 허용 (로컬 개발 편의).
     *   단, 등록·수정·삭제(POST/PUT/PATCH/DELETE)는 dev 에서도 로그인 세션을 요구한다.
     * - 그 외(prod 포함): 공개 경로만 permitAll, /api/** 는 세션 인증 필요, 나머지는 차단 (fail-closed)
     * - CSRF: 세션 쿠키 인증을 사용하므로 활성화하고, axios(SPA)가 읽을 수 있는 쿠키 토큰을 사용한다.
     * - 인증/인가 실패: 리다이렉트 대신 JSON(401/403)으로 응답한다.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
            SessionAuthenticationFilter sessionAuthenticationFilter,
            ObjectMapper objectMapper,
            CsrfTokenRepository csrfTokenRepository) throws Exception {
        boolean devPermitAll = environment.matchesProfiles("dev")
                && environment.getProperty("app.security.dev-permit-all", Boolean.class, false);

        AuthenticationEntryPoint authenticationEntryPoint = (request, response, exception) -> writeError(
                response, objectMapper, HttpServletResponse.SC_UNAUTHORIZED, "로그인이 필요합니다.");

        AccessDeniedHandler accessDeniedHandler = (request, response, exception) -> {
            boolean csrfFailure = exception instanceof InvalidCsrfTokenException
                    || exception instanceof MissingCsrfTokenException;
            writeError(response, objectMapper, HttpServletResponse.SC_FORBIDDEN,
                    csrfFailure ? "요청이 만료되었습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요." : "접근 권한이 없습니다.");
        };

        // SPA(axios) 대응: 토큰을 지연 로딩하지 않고 즉시 발급(쿠키 저장)하며, 헤더 값은 마스킹 없이 비교한다.
        CsrfTokenRequestAttributeHandler csrfTokenRequestHandler = new CsrfTokenRequestAttributeHandler();
        csrfTokenRequestHandler.setCsrfRequestAttributeName(null);

        http
                .cors(cors -> {
                })
                .csrf(csrf -> csrf
                        .csrfTokenRepository(csrfTokenRepository)
                        .csrfTokenRequestHandler(csrfTokenRequestHandler))
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                        // 세션 고정 공격 방지 (로그인 시 세션 ID 교체)
                        .sessionFixation(fixation -> fixation.changeSessionId()))
                .requestCache(cache -> cache.disable())
                .exceptionHandling(handling -> handling
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .addFilterBefore(sessionAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        if (devPermitAll) {
            log.warn("[Security] dev 전체 허용 모드가 활성화되었습니다. 읽기는 열려 있지만 등록·수정·삭제는 로그인이 필요합니다. "
                    + "운영 배포 시에는 SPRING_PROFILES_ACTIVE=prod 를 지정하세요.");
            http.authorizeHttpRequests(auth -> {
                auth.requestMatchers(PUBLIC_PATHS).permitAll();
                // 공개 경로(로그인·회원가입·챗봇)를 제외한 모든 변경 요청은 로그인 세션을 요구한다.
                // official 게시글·교역자 정보·이미지 등록처럼 공개 사이트에서 호출하는 등록 API 도 이 규칙으로 보호된다.
                for (HttpMethod method : WRITE_METHODS) {
                    auth.requestMatchers(method, "/api/**").authenticated();
                }
                auth.anyRequest().permitAll();
            });
        } else {
            http.authorizeHttpRequests(auth -> {
                auth.requestMatchers(PUBLIC_PATHS).permitAll();
                // 작성/답글 폼은 원본 게시글(비밀번호 포함)을 반환하므로 로그인 세션을 요구한다.
                auth.requestMatchers(HttpMethod.GET, OFFICIAL_FORM_PATHS).authenticated();
                // 공개 홈페이지 조회: 로그인 없이 official 콘텐츠·첨부·댓글·메뉴를 볼 수 있다.
                // 첨부는 PublicContentAccessGuard 검사를 통과한 파일만 실제로 내려간다.
                auth.requestMatchers(HttpMethod.GET, PUBLIC_READ_PATHS).permitAll();
                auth.requestMatchers("/api/**").authenticated();
                // 허용 목록에 없는 경로는 전부 차단한다 (fail-closed)
                auth.anyRequest().denyAll();
            });
        }

        return http.build();
    }

    /**
     * 인증/인가 실패 응답을 ApiResponse 형식의 JSON 으로 출력한다.
     */
    private static void writeError(HttpServletResponse response, ObjectMapper objectMapper, int status, String message)
            throws IOException {
        if (response.isCommitted()) {
            return;
        }
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        objectMapper.writeValue(response.getWriter(), ApiResponse.fail(status, message));
    }
}