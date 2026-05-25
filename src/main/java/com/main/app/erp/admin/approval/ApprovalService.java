package com.main.app.erp.admin.approval;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.admin.approval.dto.ApprovalDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApprovalService {

    private final ApprovalMapper adminApprovalMapper;

    public Page<ApprovalDto.Approval> getApprovalList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<ApprovalDto.Approval> list = adminApprovalMapper.selectApprovalList(keyword, offset, limit);
            long total = adminApprovalMapper.countApprovalList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}

