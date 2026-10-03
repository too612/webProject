package com.main.app.common.auth;

import com.main.app.common.advice.GlobalControllerAdvice;
import com.main.app.common.menu.MenuService;
import com.main.app.mypage.index.MypageIndexController;
import com.main.app.mypage.index.MypageIndexService;
import com.main.app.mypage.index.dto.MypageIndexDto;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.ui.ExtendedModelMap;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class SessionReadTest {
    @Test
    void commonAttributesDoNotCreateAnAnonymousSession() {
        var menus = mock(MenuService.class);
        when(menus.getHierarchicalMenus(anyString())).thenReturn(List.of());
        var request = new MockHttpServletRequest("GET", "/api/common/corp/getInfo");

        new GlobalControllerAdvice(menus).addCommonAttributes(new ExtendedModelMap(), request);

        assertThat(request.getSession(false)).isNull();
    }

    @Test
    void commonAttributesPreserveAnExistingSession() {
        var menus = mock(MenuService.class);
        when(menus.getHierarchicalMenus(anyString())).thenReturn(List.of());
        var request = new MockHttpServletRequest("GET", "/api/common/corp/getInfo");
        var session = request.getSession();
        session.setAttribute("userId", "session-contract-test");
        var model = new ExtendedModelMap();

        new GlobalControllerAdvice(menus).addCommonAttributes(model, request);

        assertThat(request.getSession(false)).isSameAs(session);
        assertThat(model.get("sessionUserId")).isEqualTo("session-contract-test");
    }

    @Test
    void authReadsAndLogoutDoNotCreateSessions() {
        var controller = new AuthController(null, null, null);
        var request = new MockHttpServletRequest();

        assertThat(controller.check(request).getData().get("authenticated")).isFalse();
        assertThat(controller.me(request).getStatusCode().value()).isEqualTo(401);
        assertThat(controller.logout(request).isSuccess()).isTrue();
        assertThat(request.getSession(false)).isNull();
    }

    @Test
    void sessionCheckDoesNotChangeAnExistingSession() {
        var controller = new AuthController(null, null, null);
        var request = new MockHttpServletRequest();
        var session = request.getSession();
        session.setAttribute("userId", "session-contract-test");

        assertThat(controller.check(request).getData().get("authenticated")).isTrue();
        assertThat(request.getSession(false)).isSameAs(session);
    }

    @Test
    void unauthenticatedDashboardDoesNotCreateSessionsOrQueryData() {
        var service = mock(MypageIndexService.class);
        var controller = new MypageIndexController(service);
        var request = new MockHttpServletRequest();

        for (var source : MypageIndexDto.Source.values()) {
            assertThat(controller.getIndexData(request, source).getStatusCode()).isEqualTo(401);
        }
        assertThat(request.getSession(false)).isNull();
        verifyNoInteractions(service);
    }
}
