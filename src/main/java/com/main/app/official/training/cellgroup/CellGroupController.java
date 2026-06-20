package com.main.app.official.training.cellgroup;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.training.cellgroup.dto.CellGroupDto;
import com.main.app.official.training.cellgroup.dto.CellGroupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/official/training/cellgroup")
@RequiredArgsConstructor
public class CellGroupController {

    private final CellGroupService cellGroupService;

    @GetMapping
    public ApiResponse<CellGroupDto> getCellGroup() {
        return ApiResponse.ok(cellGroupService.getCellGroup());
    }

    @PostMapping
    public ApiResponse<Void> createCellGroup(@RequestBody CellGroupRequest request) throws Exception {
        cellGroupService.createCellGroup(request);
        return ApiResponse.ok(null, "셀가족 공동체 정보를 등록했습니다.");
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> updateCellGroup(@PathVariable Long id, @RequestBody CellGroupRequest request) throws Exception {
        cellGroupService.updateCellGroup(id, request);
        return ApiResponse.ok(null, "셀가족 공동체 정보를 수정했습니다.");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCellGroup(@PathVariable Long id) throws Exception {
        cellGroupService.deleteCellGroup(id);
        return ApiResponse.ok(null, "셀가족 공동체 정보를 삭제했습니다.");
    }
}