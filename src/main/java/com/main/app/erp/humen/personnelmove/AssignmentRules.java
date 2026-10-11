package com.main.app.erp.humen.personnelmove;

import com.main.app.erp.humen.personnelmove.dto.PersonnelMoveDto.Assignment;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public final class AssignmentRules {
    private AssignmentRules() {}

    public static Assignment effective(List<Assignment> rows, LocalDate today) {
        return rows.stream().filter(row -> !row.getAssignmentDate().isAfter(today))
                .max(Comparator.comparing((Assignment row) -> Objects.requireNonNull(row).getAssignmentDate())
                        .thenComparing(row -> Objects.requireNonNull(row).getAssignmentOrder())).orElse(null);
    }

    public static void historical(Assignment old, boolean explicit, String reason, LocalDate today) {
        if (old.getAssignmentDate().isBefore(today) && (!explicit || reason == null || reason.isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "과거 발령 수정/삭제에는 명시적 확인과 사유가 필요합니다.");
        }
    }

    public static void guardHistoricalPromotion(Assignment old, Assignment replacement,
            Assignment previousEffective, LocalDate today) {
        if (old.getAssignmentDate().isBefore(today) && previousEffective != null
                && !Objects.equals(old.getAssignmentKey(), previousEffective.getAssignmentKey())
                && (!Objects.equals(old.getPersonKey(), replacement.getPersonKey())
                    || !Objects.equals(old.getConcurrentKey(), replacement.getConcurrentKey())
                    || !Objects.equals(old.getAssignmentDate(), replacement.getAssignmentDate())
                    || !Objects.equals(old.getAssignmentOrder(), replacement.getAssignmentOrder()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "과거 이력의 대상/일자/순서는 변경할 수 없습니다. 새 발령을 등록하세요.");
        }
    }

    public static void deletion(List<Assignment> remaining, LocalDate today) {
        if (remaining.isEmpty() || effective(remaining, today) == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "마지막 발령 또는 유일한 도래 발령은 삭제할 수 없습니다.");
        }
    }
}
