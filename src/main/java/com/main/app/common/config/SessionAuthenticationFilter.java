package com.main.app.common.config;

import com.main.app.common.auth.PermissionService;
import com.main.app.common.auth.UserMapper;
import com.main.app.common.auth.dto.UserDto;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * 세션에 저장된 사용자 정보로 Spring Security 인증 정보를 복원한다.
 * <p>
 * 세션 속성만 신뢰하지 않고, 일정 주기로 계정 상태를 재검증해 탈퇴/비활성 사용자의 세션이 계속 유효한 상태로
 * 남는 문제를 막는다. 재검증 주기는 app.security.session.revalidate-ms 로 조정한다.
 */
@Slf4j
@Component
public class SessionAuthenticationFilter extends OncePerRequestFilter {

    private static final String SESSION_USER_ID_KEY = "userId";
    private static final String SESSION_VALIDATED_AT_KEY = "auth.validatedAt";
    private static final String SESSION_ROLES_KEY = "auth.roles";
    private static final String ACTIVE_STATUS = "A";

    private final UserMapper userMapper;
    private final PermissionService permissionService;
    private final long revalidateMillis;

    public SessionAuthenticationFilter(UserMapper userMapper,
            PermissionService permissionService,
            @Value("${app.security.session.revalidate-ms:60000}") long revalidateMillis) {
        this.userMapper = userMapper;
        this.permissionService = permissionService;
        this.revalidateMillis = Math.max(0, revalidateMillis);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            HttpSession session = request.getSession(false);
            Object userId = session == null ? null : session.getAttribute(SESSION_USER_ID_KEY);
            if (userId != null) {
                String userIdValue = String.valueOf(userId);
                if (isSessionActive(session, userIdValue)) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userIdValue,
                            null,
                            resolveAuthorities(session));
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * 세션 사용자가 아직 유효한지 재검증한다.
     *
     * @return false 이면 세션을 폐기했으므로 인증 정보를 만들지 않는다.
     */
    private boolean isSessionActive(HttpSession session, String userId) {
        long now = System.currentTimeMillis();
        Object validatedAt = session.getAttribute(SESSION_VALIDATED_AT_KEY);
        if (validatedAt instanceof Long lastValidatedAt && now - lastValidatedAt < revalidateMillis) {
            return true;
        }

        try {
            UserDto user = userMapper.selectUserByUserId(userId);
            if (user == null || !ACTIVE_STATUS.equals(user.getStatus())) {
                log.info("[Security] 세션 사용자 상태가 유효하지 않아 세션을 폐기합니다. userId={}", userId);
                session.invalidate();
                return false;
            }
            session.setAttribute(SESSION_VALIDATED_AT_KEY, now);
            session.setAttribute(SESSION_ROLES_KEY, permissionService.getUserRoleIds(userId));
            return true;
        } catch (Exception exception) {
            // DB 일시 장애로 정상 사용자 세션이 모두 끊기지 않도록 기존 세션은 유지한다.
            log.warn("[Security] 세션 유효성 재검증에 실패하여 기존 세션을 유지합니다. userId={}", userId, exception);
            return true;
        }
    }

    /**
     * 세션에 캐시된 역할 ID 를 ROLE_ 접두어 권한으로 변환한다.
     */
    private List<GrantedAuthority> resolveAuthorities(HttpSession session) {
        Object roles = session.getAttribute(SESSION_ROLES_KEY);
        if (!(roles instanceof List<?> roleIds) || roleIds.isEmpty()) {
            return List.of();
        }

        List<GrantedAuthority> authorities = new ArrayList<>(roleIds.size());
        for (Object roleId : roleIds) {
            if (roleId == null) {
                continue;
            }
            String value = String.valueOf(roleId).trim();
            if (!value.isEmpty()) {
                authorities.add(new SimpleGrantedAuthority("ROLE_" + value));
            }
        }
        return authorities;
    }
}

