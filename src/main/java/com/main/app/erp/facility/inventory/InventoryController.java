package com.main.app.erp.facility.inventory;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.facility.inventory.dto.InventoryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpFacilityInventoryController")
@RequestMapping("/api/erp/facility/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ApiResponse<Page<InventoryDto.Inventory>> getInventoryList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(inventoryService.getInventoryList(page, keyword));
    }
}