package com.main.app.community.saint.sales;

import com.main.app.common.dto.ApiResponse;
import com.main.app.community.saint.sales.dto.SalesDto;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller("communitySaintSalesController")
public class SalesController {

    private final SalesService salesService;

    public SalesController(SalesService salesService) {
        this.salesService = salesService;
    }

    @GetMapping("/community/saint/sales")
    public String salesPage(Model model) {
        model.addAttribute("submenu", "Y");
        return "community/saint/sales";
    }

    @GetMapping("/api/community/saint/sales")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getSalesList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        Page<SalesDto> data = salesService.getList(page, size, keyword);
        return ApiResponse.ok(Map.of(
                "content", data.getContent(),
                "totalElements", data.getTotalElements(),
                "totalPages", data.getTotalPages(),
                "number", data.getNumber(),
                "size", data.getSize()));
    }
}