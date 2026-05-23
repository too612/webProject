package com.main.app.common.util;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

public final class PaginationUtil {

    private PaginationUtil() {
    }

    @SuppressWarnings("null")
    public static <T> Page<T> toPage(List<T> items, Pageable pageable, long total) {
        List<T> safeItems = items == null ? Collections.emptyList() : items;
        Pageable safePageable = Objects.requireNonNullElseGet(pageable, Pageable::unpaged);
        return new PageImpl<>(safeItems, safePageable, total);
    }
}