package com.main.app.erp.sermon.order;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.sermon.order.dto.OrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpSermonOrderService")
@RequiredArgsConstructor
public class OrderService {

    private final OrderMapper orderMapper;

    public Page<OrderDto.Order> getOrderList(int page, String worshipId) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<OrderDto.Order> list = orderMapper.selectOrderList(worshipId, offset, limit);
            long total = orderMapper.countOrderList(worshipId);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
