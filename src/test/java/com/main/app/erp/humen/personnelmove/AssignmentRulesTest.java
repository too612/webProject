package com.main.app.erp.humen.personnelmove;

import com.main.app.erp.humen.personnelmove.dto.PersonnelMoveDto.Assignment;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import static org.assertj.core.api.Assertions.*;

class AssignmentRulesTest {
    private final LocalDate today = LocalDate.of(2026, 10, 9);

    @Test
    void latestDueUsesDateThenPositiveOrderAndNeverEndDate() {
        Assignment older = row("older", today.minusDays(3), 9);
        Assignment first = row("first", today, 1);
        Assignment last = row("last", today, 2);
        last.setAssignmentEndDate(today.minusDays(1));
        Assignment future = row("future", today.plusDays(1), 3);
        assertThat(AssignmentRules.effective(List.of(older, first, last, future), today)).isSameAs(last);
        assertThat(AssignmentRules.effective(List.of(future), today)).isNull();
    }

    @Test
    void pastEditRequiresExplicitFlagAndReasonButTodayDoesNot() {
        Assignment old = row("old", today.minusDays(1), 1);
        assertThatThrownBy(() -> AssignmentRules.historical(old, false, "reason", today)).isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> AssignmentRules.historical(old, true, " ", today)).isInstanceOf(ResponseStatusException.class);
        assertThatCode(() -> AssignmentRules.historical(old, true, "correction", today)).doesNotThrowAnyException();
        assertThatCode(() -> AssignmentRules.historical(row("today", today, 1), false, null, today)).doesNotThrowAnyException();
    }

    @Test
    void deletingLastOrOnlyDueRowIsRejected() {
        assertThatThrownBy(() -> AssignmentRules.deletion(List.of(), today)).isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> AssignmentRules.deletion(List.of(row("future", today.plusDays(1), 1)), today))
                .isInstanceOf(ResponseStatusException.class);
        assertThatCode(() -> AssignmentRules.deletion(List.of(row("old", today.minusDays(1), 1)), today)).doesNotThrowAnyException();
    }

    @Test
    void historicalNonEffectiveCannotBePromotedByDateOrderOrTargetChange() {
        Assignment old = row("old", today.minusDays(10), 1);
        Assignment effective = row("due", today.minusDays(1), 1);
        Assignment replacement = row("old", today, 1);
        assertThatThrownBy(() -> AssignmentRules.guardHistoricalPromotion(old, replacement, effective, today))
                .isInstanceOf(ResponseStatusException.class);
        replacement.setAssignmentDate(old.getAssignmentDate());
        replacement.setAssignmentOrder(2);
        assertThatThrownBy(() -> AssignmentRules.guardHistoricalPromotion(old, replacement, effective, today))
                .isInstanceOf(ResponseStatusException.class);
        replacement.setAssignmentOrder(1);
        replacement.setConcurrentKey("concurrent");
        assertThatThrownBy(() -> AssignmentRules.guardHistoricalPromotion(old, replacement, effective, today))
                .isInstanceOf(ResponseStatusException.class);
        replacement.setConcurrentKey(null);
        assertThatCode(() -> AssignmentRules.guardHistoricalPromotion(old, replacement, effective, today)).doesNotThrowAnyException();
    }

    private Assignment row(String key, LocalDate date, int order) {
        Assignment row = new Assignment();
        row.setAssignmentKey(key);
        row.setPersonKey("original");
        row.setAssignmentDate(date);
        row.setAssignmentOrder(order);
        return row;
    }
}
