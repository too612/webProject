package com.main.app.official.training.cellgroup;

import com.main.app.official.training.cellgroup.dto.CellGroupDto;
import com.main.app.official.training.cellgroup.dto.CellGroupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CellGroupService {

    private final CellGroupMapper cellGroupMapper;

    @Transactional(readOnly = true)
    public CellGroupDto getCellGroup() {
        return cellGroupMapper.selectCellGroup();
    }

    @Transactional
    public void createCellGroup(CellGroupRequest request) throws Exception {
        int result = cellGroupMapper.insertCellGroup(request);
        if (result != 1) {
            throw new Exception("셀가족 공동체 정보 등록에 실패했습니다.");
        }
    }

    @Transactional
    public void updateCellGroup(Long id, CellGroupRequest request) throws Exception {
        int result = cellGroupMapper.updateCellGroup(id, request);
        if (result != 1) {
            throw new Exception("셀가족 공동체 정보 수정에 실패했습니다.");
        }
    }

    @Transactional
    public void deleteCellGroup(Long id) throws Exception {
        int result = cellGroupMapper.deleteCellGroup(id);
        if (result != 1) {
            throw new Exception("셀가족 공동체 정보 삭제에 실패했습니다.");
        }
    }
}