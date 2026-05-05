package com.main.app.erp.account;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.main.app.common.dto.ApiResponse;

@RestController
@RequestMapping("/api/erp/account")
public class AccountApiController {

    @GetMapping("/manager")
    public ApiResponse<Map<String, Object>> getManagerList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size));
    }

    @GetMapping("/input")
    public ApiResponse<Map<String, Object>> getInputList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size));
    }

    @GetMapping("/budget")
    public ApiResponse<Map<String, Object>> getBudgetList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size));
    }

    @GetMapping("/expense")
    public ApiResponse<Map<String, Object>> getExpenseList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size));
    }

    @GetMapping("/report")
    public ApiResponse<Map<String, Object>> getReport(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month) {
        return ApiResponse.ok(Map.of(
                "income", 0,
                "expense", 0,
                "balance", 0,
                "items", List.of()));
    }
}
