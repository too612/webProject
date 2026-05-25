package com.main.app.community.saint.job;

import com.main.app.common.util.PaginationUtil;
import com.main.app.community.saint.job.dto.JobDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobMapper jobMapper;

    public JobService(JobMapper jobMapper) {
        this.jobMapper = jobMapper;
    }

    public Page<JobDto> getList(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        List<JobDto> list = jobMapper.selectBoards(keyword, (int) pageable.getOffset(), pageable.getPageSize());
        long total = jobMapper.countBoards(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }
}