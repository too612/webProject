package com.main.app.common.excel;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.UUID;
import java.util.function.Supplier;

@Component
public class ExcelSnapshotStore {
    private static final String KEY = ExcelSnapshotStore.class.getName();
    private final long ttl;
    private final int maxSnapshots;
    private record Grant(String owner, Instant expires, ExcelModel.Snapshot original,
                         Supplier<ExcelModel.Snapshot> reload) {}
    private static final class Grants {
        final LinkedHashMap<String, Grant> entries = new LinkedHashMap<>();
    }
    public ExcelSnapshotStore(@Value("${app.excel.snapshot-ttl-seconds:1800}") long ttl,
                              @Value("${app.excel.max-snapshots-per-session:256}") int maxSnapshots) {
        if (ttl <= 0 || maxSnapshots <= 0) throw new IllegalArgumentException("엑셀 조회 보관 설정이 올바르지 않습니다.");
        this.ttl = ttl;
        this.maxSnapshots = maxSnapshots;
    }
    public String issue(HttpSession session, ExcelModel.Snapshot snapshot, Supplier<ExcelModel.Snapshot> reload) {
        synchronized (session) {
            Grants grants = grants(session);
            grants.entries.values().removeIf(grant -> grant.expires().isBefore(Instant.now()));
            while (grants.entries.size() >= maxSnapshots) grants.entries.remove(grants.entries.keySet().iterator().next());
            String token = UUID.randomUUID().toString();
            grants.entries.put(token, new Grant(String.valueOf(session.getAttribute("userId")),
                    Instant.now().plusSeconds(ttl), snapshot, reload));
            return token;
        }
    }
    public ExcelModel.Snapshot verify(HttpSession session, String token) {
        Grant grant;
        synchronized (session) { grant = grants(session).entries.get(token); }
        if (grant == null || grant.expires().isBefore(Instant.now()) ||
                !grant.owner().equals(String.valueOf(session.getAttribute("userId")))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "엑셀 조회 정보가 만료되었습니다. 화면을 다시 조회하세요.");
        }
        var current = grant.reload().get();
        if (!grant.original().equals(current)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "조회 후 데이터가 변경되었습니다. 화면을 다시 조회하세요.");
        }
        return current;
    }
    private Grants grants(HttpSession session) {
        if (session.getAttribute(KEY) instanceof Grants grants) return grants;
        Grants grants = new Grants();
        session.setAttribute(KEY, grants);
        return grants;
    }
}