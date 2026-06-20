package com.main.app.official.news.nextsteps;

import com.main.app.official.news.nextsteps.dto.NextstepsDto;
import com.main.app.official.news.nextsteps.dto.NextstepsRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NextstepsService {
    private final NextstepsMapper nextstepsMapper;

    @Transactional(readOnly = true)
    public NextstepsDto getNextsteps() { return nextstepsMapper.selectNextsteps(); }

    @Transactional
    public void createNextsteps(NextstepsRequest request) throws Exception {
        if (nextstepsMapper.insertNextsteps(request) != 1) throw new Exception("새가족안내 등록에 실패했습니다.");
    }

    @Transactional
    public void updateNextsteps(NextstepsRequest request) throws Exception {
        if (nextstepsMapper.updateNextsteps(request) != 1) throw new Exception("새가족안내 수정에 실패했습니다.");
    }

    @Transactional
    public void deleteNextsteps(String id) throws Exception {
        if (nextstepsMapper.deleteNextsteps(id) != 1) throw new Exception("새가족안내 삭제에 실패했습니다.");
    }
}