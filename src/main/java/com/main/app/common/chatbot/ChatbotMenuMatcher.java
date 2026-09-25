package com.main.app.common.chatbot;

import com.main.app.common.menu.MenuMapper;
import com.main.app.common.menu.dto.MenuDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class ChatbotMenuMatcher {

    private static final int MIN_MATCH_SCORE = 25;
        private static final Pattern QUESTION_ENDING =
            Pattern.compile("(알려주세요|알려줘|해주세요|해줘|궁금해|알고싶어|어디)$", Pattern.CANON_EQ);

    private final MenuMapper menuMapper;

    public MenuMatch findBest(String normalizedMessage) {
        if (normalizedMessage == null || normalizedMessage.isBlank()) {
            return null;
        }

        String focusedMessage = removeQuestionEnding(normalizedMessage);

        List<MenuDto> menus = menuMapper.getMenuList("official");
        if (menus == null || menus.isEmpty()) {
            return null;
        }

        Map<String, MenuDto> menuById = toMenuMap(menus);

        MenuMatch best = null;
        for (MenuDto menu : menus) {
            if (!isSearchable(menu)) {
                continue;
            }
            int score = scoreMenu(focusedMessage, menu, menuById);
            if (score >= MIN_MATCH_SCORE && (best == null || score > best.score())) {
                best = new MenuMatch(menu.getMenuId(), menu.getPath(), score);
            }
        }
        return best;
    }

    private String removeQuestionEnding(String message) {
        return QUESTION_ENDING.matcher(message).replaceAll("");
    }

    private Map<String, MenuDto> toMenuMap(List<MenuDto> menus) {
        Map<String, MenuDto> menuById = new HashMap<>();
        for (MenuDto menu : menus) {
            if (menu != null && menu.getMenuId() != null) {
                menuById.put(menu.getMenuId(), menu);
            }
        }
        return menuById;
    }

    private boolean isSearchable(MenuDto menu) {
        return menu != null && menu.getPath() != null && !menu.getPath().isBlank()
                && !"M_MAIN".equals(menu.getMenuId());
    }

    private int scoreMenu(String message, MenuDto menu, Map<String, MenuDto> menuById) {
        MenuDto parent = menu.getParentId() == null ? null : menuById.get(menu.getParentId());
        return score(message, menu.getMenuName())
                + score(message, menu.getMenuSummary())
                + score(message, parent == null ? null : parent.getMenuName())
                + score(message, menu.getPath());
    }

    private int score(String message, String candidate) {
        String normalizedCandidate = ChatbotTextUtil.normalizeQuery(candidate);
        if (normalizedCandidate.isBlank()) {
            return 0;
        }
        if (message.equals(normalizedCandidate)) {
            return 100;
        }
        if (message.contains(normalizedCandidate)) {
            return 50;
        }
        if (normalizedCandidate.contains(message) && message.length() >= 2) {
            return 25;
        }
        return 0;
    }

    public record MenuMatch(String menuId, String path, int score) {
    }
}