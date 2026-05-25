package com.main.app.community.world.economic;

import com.main.app.common.util.PaginationUtil;
import com.main.app.community.world.economic.dto.EconomicDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EconomicService {

    private final EconomicMapper economicMapper;

    public EconomicService(EconomicMapper economicMapper) {
        this.economicMapper = economicMapper;
    }

    public Page<EconomicDto> getList(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        List<EconomicDto> list = economicMapper.selectBoards(keyword, (int) pageable.getOffset(), pageable.getPageSize());
        long total = economicMapper.countBoards(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}