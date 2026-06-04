package com.main.app.official.about.congregation;

import com.main.app.official.about.congregation.dto.CongregationDto;
import com.main.app.official.about.congregation.dto.CongregationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CongregationService {

    private final CongregationMapper congregationMapper;

    @Transactional(readOnly = true)
    public CongregationDto getCongregation() {
        return congregationMapper.selectCongregation();
    }

    @Transactional
    public void createCongregation(CongregationRequest request) throws Exception {
        int result = congregationMapper.insertCongregation(request);
        if (result != 1) {
            throw new Exception("공동체 안내 정보 등록에 실패했습니다.");
        }
    }

    @Transactional
    public void updateCongregation(Long id, CongregationRequest request) throws Exception {
        int result = congregationMapper.updateCongregation(id, request);
        if (result != 1) {
            throw new Exception("공동체 안내 정보 수정에 실패했습니다.");
        }
    }

    @Transactional
    public void deleteCongregation(Long id) throws Exception {
        int result = congregationMapper.deleteCongregation(id);
        if (result != 1) {
            throw new Exception("공동체 안내 정보 삭제에 실패했습니다.");
        }
    }
}
