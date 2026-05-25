package com.main.app.erp.sermon.order;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.sermon.order.dto.OrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpSermonOrderController")
@RequestMapping("/api/erp/sermon/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ApiResponse<Page<OrderDto.Order>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String worshipId) {
        return ApiResponse.ok(orderService.getOrderList(page, worshipId));
    }
}
