package com.main.app.erp.index;

import com.main.app.erp.index.dto.ErpIndexDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ErpIndexService {

    private final ErpIndexMapper erpIndexMapper;

    @Transactional(readOnly = true)
    public ErpIndexDto getIndexData() {
        ErpIndexDto dto = new ErpIndexDto();
        dto.setTotalMembers(erpIndexMapper.selectTotalMembers());
        dto.setSermonPendingCount(erpIndexMapper.selectSermonPendingCount());
        dto.setAccountRecordCount(erpIndexMapper.selectAccountRecordCount());
        dto.setRecentSermonTasks(erpIndexMapper.selectRecentSermonTasks());
        return dto;
    }
}
