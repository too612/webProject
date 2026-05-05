package com.main.app.common.api;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class ApiResponse<T> {
    private final boolean success;
    private final T data;
    private final String message;
    private final int statusCode;
    private final LocalDateTime timestamp;

    private ApiResponse(boolean success, T data, String message, int statusCode) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
        this.timestamp = LocalDateTime.now();
    }

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null, 200);
    }

    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, data, message, 200);
    }

    public static <T> ApiResponse<T> fail(int statusCode, String message) {
        return new ApiResponse<>(false, null, message, statusCode);
    }
}