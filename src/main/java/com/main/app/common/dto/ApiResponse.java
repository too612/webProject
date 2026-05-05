package com.main.app.common.dto;

import java.time.LocalDateTime;

public class ApiResponse<T> {

    private boolean success;
    private T data;
    private String message;
    private int statusCode;
    private LocalDateTime timestamp;

    public ApiResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public static <T> ApiResponse<T> ok(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = true;
        response.data = data;
        response.statusCode = 200;
        response.message = "OK";
        return response;
    }

    public static <T> ApiResponse<T> ok(T data, String message) {
        ApiResponse<T> response = ok(data);
        response.message = message;
        return response;
    }

    public static <T> ApiResponse<T> fail(int statusCode, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = false;
        response.statusCode = statusCode;
        response.message = message;
        return response;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}