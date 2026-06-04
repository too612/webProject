package com.main.app.common.util;

public final class StringUtil {

    private StringUtil() {
    }

    public static String toEmpty(Object value) {
        return value == null ? "" : value.toString();
    }

    public static String trimToEmpty(String value) {
        return value == null ? "" : value.trim();
    }

    public static String coalesceBlank(String value, String defaultValue) {
        return (value == null || value.isBlank()) ? defaultValue : value;
    }
}