package com.main.app.community.saint;

import com.main.app.common.util.PaginationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("communitySaintService")
public class SaintService {

    private static final String SAINT_FAMILY = "COMMUNITY_SAINT_FAMILY";
    private static final String SAINT_PRAY = "COMMUNITY_SAINT_PRAY";
    private static final String SAINT_SALES = "COMMUNITY_SAINT_SALES";
    private static final String SAINT_JOB = "COMMUNITY_SAINT_JOB";

    private final SaintMapper saintMapper;

    public SaintService(SaintMapper saintMapper) {
        this.saintMapper = saintMapper;
    }

    public Page<SaintDto> getFamilyList(int page, int size, String keyword) {
        return getPaged(page, size, keyword, SAINT_FAMILY);
    }

    public Page<SaintDto> getPrayList(int page, int size, String keyword) {
        return getPaged(page, size, keyword, SAINT_PRAY);
    }

    public Page<SaintDto> getSalesList(int page, int size, String keyword) {
        return getPaged(page, size, keyword, SAINT_SALES);
    }

    public Page<SaintDto> getJobList(int page, int size, String keyword) {
        return getPaged(page, size, keyword, SAINT_JOB);
    }

    private Page<SaintDto> getPaged(int page, int size, String keyword, String boardType) {
        Pageable pageable = PageRequest.of(page, size);
        List<SaintDto> list = saintMapper.selectBoards(boardType, keyword, (int) pageable.getOffset(),
                pageable.getPageSize());
        long total = saintMapper.countBoards(boardType, keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}
