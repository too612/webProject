package com.main.app.official.about.vision;

import com.main.app.official.about.vision.dto.VisionDto;
import com.main.app.official.about.vision.dto.VisionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VisionService {

    private final VisionMapper visionMapper;

    @Transactional(readOnly = true)
    public VisionDto getVision() {
        return visionMapper.selectVision();
    }

    @Transactional
    public void createVision(VisionRequest request) throws Exception {
        int result = visionMapper.insertVision(request);
        if (result != 1) {
            throw new Exception("비전 정보 등록에 실패했습니다.");
        }
    }

    @Transactional
    public void updateVision(Long id, VisionRequest request) throws Exception {
        int result = visionMapper.updateVision(id, request);
        if (result != 1) {
            throw new Exception("비전 정보 수정에 실패했습니다.");
        }
    }

    @Transactional
    public void deleteVision(Long id) throws Exception {
        int result = visionMapper.deleteVision(id);
        if (result != 1) {
            throw new Exception("비전 정보 삭제에 실패했습니다.");
        }
    }
}
