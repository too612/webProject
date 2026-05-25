package com.main.app.erp.sermon.write;

import com.main.app.erp.sermon.write.dto.WriteDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("erpSermonWriteService")
@RequiredArgsConstructor
public class WriteService {

    private final WriteMapper writeMapper;

    @Transactional
    public void createWorship(WriteDto.WriteRequest req) {
        if (req == null || req.getTitle() == null || req.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("설교 제목은 필수입니다.");
        }
        if (req.getPreacher() == null || req.getPreacher().trim().isEmpty()) {
            throw new IllegalArgumentException("설교자는 필수입니다.");
        }
        if (req.getSermonDate() == null || req.getSermonDate().trim().isEmpty()) {
            throw new IllegalArgumentException("설교일은 필수입니다.");
        }

        int inserted = writeMapper.insertWorship(req);
        if (inserted != 1) {
            throw new IllegalStateException("설교 등록에 실패했습니다.");
        }
    }
}
