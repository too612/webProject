package com.main.app.erp.sermon;

import com.main.app.common.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service("erpSermonService")
@RequiredArgsConstructor
public class SermonService {

    private final SermonMapper sermonMapper;

    public Page<SermonErpDto.Worship> getWorshipList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<SermonErpDto.Worship> list = sermonMapper.selectWorshipList(keyword, offset, limit);
        long total = sermonMapper.countWorshipList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<SermonErpDto.Worship> getArchiveList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<SermonErpDto.Worship> list = sermonMapper.selectArchiveList(keyword, offset, limit);
        long total = sermonMapper.countArchiveList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<SermonErpDto.Attendance> getAttendanceList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<SermonErpDto.Attendance> list = sermonMapper.selectAttendanceList(keyword, offset, limit);
        long total = sermonMapper.countAttendanceList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<SermonErpDto.Order> getOrderList(int page, String worshipId) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<SermonErpDto.Order> list = sermonMapper.selectOrderList(worshipId, offset, limit);
        long total = sermonMapper.countOrderList(worshipId);
        return PaginationUtil.toPage(list, pageable, total);
    }
}
