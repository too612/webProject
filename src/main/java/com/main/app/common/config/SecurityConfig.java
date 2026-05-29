package com.main.app.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

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
     * Spring Security 설정
     * - dev: 전체 허용 (기존 개발 흐름 유지)
     * - prod: /api/auth/** 제외 /api/** 세션 인증 필요
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, SessionAuthenticationFilter sessionAuthenticationFilter)
            throws Exception {
        boolean isProd = environment.matchesProfiles("prod");

        HttpSecurity builder = http
                .cors(cors -> {
                })
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .addFilterBefore(sessionAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        if (isProd) {
            builder.authorizeHttpRequests(auth -> auth
                    .requestMatchers(
                            "/api/auth/**",
                            "/",
                            "/index.html",
                            "/assets/**",
                            "/img/**",
                            "/favicon.ico",
                            "/error")
                    .permitAll()
                    .requestMatchers("/api/**").authenticated()
                    .anyRequest().permitAll());
        } else {
            builder.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        }

        return builder.build();
    }
}