package com.main.app.community.group.manager;

import com.main.app.common.util.PaginationUtil;
import com.main.app.community.group.manager.dto.ManagerDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("communityGroupManagerService")
public class ManagerService {

    private final ManagerMapper managerMapper;

    public ManagerService(ManagerMapper managerMapper) {
        this.managerMapper = managerMapper;
    }

    public Page<ManagerDto> getList(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        List<ManagerDto> list = managerMapper.selectBoards(keyword, (int) pageable.getOffset(), pageable.getPageSize());
        long total = managerMapper.countBoards(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}
