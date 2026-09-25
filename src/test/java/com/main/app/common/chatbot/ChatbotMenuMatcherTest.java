package com.main.app.common.chatbot;

import com.main.app.common.menu.MenuMapper;
import com.main.app.common.menu.dto.MenuDto;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class ChatbotMenuMatcherTest {

    @Test
    void matchesOfficialMenuByMenuName() {
        MenuDto menu = menu("M_MAIN_02_01", "예배시간 안내", "/worship/time", "M_MAIN_02");
        MenuMapper mapper = mock(MenuMapper.class);
        when(mapper.getMenuList("official")).thenReturn(List.of(menu));
        ChatbotMenuMatcher matcher = new ChatbotMenuMatcher(mapper);

        ChatbotMenuMatcher.MenuMatch result = matcher.findBest(
                ChatbotTextUtil.normalizeQuery("예배시간 알려줘"));

        assertNotNull(result);
        assertEquals("/worship/time", result.path());
    }

    @Test
    void ignoresMainRootMenuWithoutPageIntent() {
        MenuDto menu = menu("M_MAIN", "메인", "/official", null);
        MenuMapper mapper = mock(MenuMapper.class);
        when(mapper.getMenuList("official")).thenReturn(List.of(menu));
        ChatbotMenuMatcher matcher = new ChatbotMenuMatcher(mapper);

        ChatbotMenuMatcher.MenuMatch result = matcher.findBest(
                ChatbotTextUtil.normalizeQuery("메인"));

        org.junit.jupiter.api.Assertions.assertNull(result);
    }

    private MenuDto menu(String id, String name, String path, String parentId) {
        MenuDto menu = new MenuDto();
        menu.setMenuId(id);
        menu.setMenuName(name);
        menu.setPath(path);
        menu.setParentId(parentId);
        return menu;
    }
}