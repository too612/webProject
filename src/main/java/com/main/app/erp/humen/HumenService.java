package com.main.app.erp.humen;

import com.main.app.common.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service("erpHumenService")
@RequiredArgsConstructor
public class HumenService {

    private final HumenMapper humenMapper;

    public Page<HumenDto.Member> getMemberList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<HumenDto.Member> list = humenMapper.selectMemberList(keyword, offset, limit);
        long total = humenMapper.countMemberList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<HumenDto.Member> getNewcomerList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<HumenDto.Member> list = humenMapper.selectNewcomerList(keyword, offset, limit);
        long total = humenMapper.countNewcomerList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<HumenDto.District> getDistrictList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<HumenDto.District> list = humenMapper.selectDistrictList(keyword, offset, limit);
        long total = humenMapper.countDistrictList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    public Page<HumenDto.Change> getChangeList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<HumenDto.Change> list = humenMapper.selectChangeList(keyword, offset, limit);
        long total = humenMapper.countChangeList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}
