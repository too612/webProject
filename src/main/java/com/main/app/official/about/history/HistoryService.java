package com.main.app.official.about.history;

import com.main.app.official.about.history.dto.HistoryDto;
import com.main.app.official.about.history.dto.HistoryRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryMapper historyMapper;

    @Transactional(readOnly = true)
    public HistoryDto getHistory() {
        return historyMapper.selectHistory();
    }

    @Transactional
    public void createHistory(HistoryRequest request) throws Exception {
        int result = historyMapper.insertHistory(request);
        if (result != 1) {
            throw new Exception("연혁 정보 등록에 실패했습니다.");
        }
    }

    @Transactional
    public void updateHistory(Long id, HistoryRequest request) throws Exception {
        int result = historyMapper.updateHistory(id, request);
        if (result != 1) {
            throw new Exception("연혁 정보 수정에 실패했습니다.");
        }
    }

    @Transactional
    public void deleteHistory(Long id) throws Exception {
        int result = historyMapper.deleteHistory(id);
        if (result != 1) {
            throw new Exception("연혁 정보 삭제에 실패했습니다.");
        }
    }
}
