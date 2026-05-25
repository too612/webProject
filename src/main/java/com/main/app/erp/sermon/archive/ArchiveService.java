package com.main.app.erp.sermon.archive;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.sermon.archive.dto.ArchiveDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpSermonArchiveService")
@RequiredArgsConstructor
public class ArchiveService {

    private final ArchiveMapper archiveMapper;

    public Page<ArchiveDto.Archive> getArchiveList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<ArchiveDto.Archive> list = archiveMapper.selectArchiveList(keyword, offset, limit);
            long total = archiveMapper.countArchiveList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
