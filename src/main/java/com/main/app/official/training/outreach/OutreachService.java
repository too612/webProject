package com.main.app.official.training.outreach;

import com.main.app.official.training.outreach.dto.OutreachDto;
import com.main.app.official.training.outreach.dto.OutreachRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OutreachService {
    private final OutreachMapper outreachMapper;

    @Transactional(readOnly = true)
    public OutreachDto getOutreach() { return outreachMapper.selectOutreach(); }

    @Transactional
    public void createOutreach(OutreachRequest request) throws Exception {
        if (outreachMapper.insertOutreach(request) != 1) throw new Exception("아웃리치 정보 등록에 실패했습니다.");
    }

    @Transactional
    public void updateOutreach(Long id, OutreachRequest request) throws Exception {
        if (outreachMapper.updateOutreach(id, request) != 1) throw new Exception("아웃리치 정보 수정에 실패했습니다.");
    }

    @Transactional
    public void deleteOutreach(Long id) throws Exception {
        if (outreachMapper.deleteOutreach(id) != 1) throw new Exception("아웃리치 정보 삭제에 실패했습니다.");
    }
}