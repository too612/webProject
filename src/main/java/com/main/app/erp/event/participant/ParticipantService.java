package com.main.app.erp.event.participant;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.event.participant.dto.ParticipantDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpEventParticipantService")
@RequiredArgsConstructor
public class ParticipantService {

    private final ParticipantMapper participantMapper;

    public Page<ParticipantDto.Participant> getParticipantList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<ParticipantDto.Participant> list = participantMapper.selectParticipantList(keyword, offset, limit);
            long total = participantMapper.countParticipantList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}