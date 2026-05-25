package com.main.app.erp.sermon.order;

import com.main.app.erp.sermon.order.dto.OrderDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrderMapper {

    List<OrderDto.Order> selectOrderList(
            @Param("worshipId") String worshipId,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countOrderList(@Param("worshipId") String worshipId);
}
