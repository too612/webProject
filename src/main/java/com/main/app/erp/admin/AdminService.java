package com.main.app.erp.admin;

import com.main.app.common.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service("erpAdminService")
@RequiredArgsConstructor
public class AdminService {

    private final AdminMapper adminMapper;

    public Page<AdminDto.Certificate> getCertificateList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<AdminDto.Certificate> list = adminMapper.selectCertificateList(keyword, offset, limit);
        long total = adminMapper.countCertificateList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<AdminDto.Approval> getApprovalList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<AdminDto.Approval> list = adminMapper.selectApprovalList(keyword, offset, limit);
        long total = adminMapper.countApprovalList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<AdminDto.Minutes> getMinutesList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<AdminDto.Minutes> list = adminMapper.selectMinutesList(keyword, offset, limit);
        long total = adminMapper.countMinutesList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<AdminDto.Archive> getArchiveList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<AdminDto.Archive> list = adminMapper.selectArchiveList(keyword, offset, limit);
        long total = adminMapper.countArchiveList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}
