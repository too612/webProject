package com.main.app.official.about.beliefs;

import com.main.app.official.about.beliefs.dto.BeliefsDto;
import com.main.app.official.about.beliefs.dto.BeliefsRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BeliefsService {

    private final BeliefsMapper beliefsMapper;

    @Transactional(readOnly = true)
    public BeliefsDto getBeliefs() {
        return beliefsMapper.selectBeliefs();
    }

    @Transactional
    public void createBeliefs(BeliefsRequest request) throws Exception {
        int result = beliefsMapper.insertBeliefs(request);
        if (result != 1) {
            throw new Exception("신앙고백 정보 등록에 실패했습니다.");
        }
    }

    @Transactional
    public void updateBeliefs(Long id, BeliefsRequest request) throws Exception {
        int result = beliefsMapper.updateBeliefs(id, request);
        if (result != 1) {
            throw new Exception("신앙고백 정보 수정에 실패했습니다.");
        }
    }

    @Transactional
    public void deleteBeliefs(Long id) throws Exception {
        int result = beliefsMapper.deleteBeliefs(id);
        if (result != 1) {
            throw new Exception("신앙고백 정보 삭제에 실패했습니다.");
        }
    }
}
