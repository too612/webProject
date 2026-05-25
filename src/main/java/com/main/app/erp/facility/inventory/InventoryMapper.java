package com.main.app.erp.facility.inventory;

import com.main.app.erp.facility.inventory.dto.InventoryDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface InventoryMapper {

    List<InventoryDto.Inventory> selectInventoryList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countInventoryList(@Param("keyword") String keyword);
}