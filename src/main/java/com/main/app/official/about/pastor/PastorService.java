package com.main.app.official.about.pastor;

import com.main.app.official.about.pastor.dto.PastorDto;
import com.main.app.official.about.pastor.dto.PastorRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("officialPastorService")
@RequiredArgsConstructor
public class PastorService {

    private final PastorMapper pastorMapper;

    @Transactional(readOnly = true)
    public PastorDto getPastorProfile() {
        return pastorMapper.selectPastorProfile();
    }

    @Transactional
    public void createPastorProfile(PastorRequest request) throws Exception {
        if (request.getChiefName() == null || request.getChiefName().isBlank()) {
            throw new IllegalArgumentException("담임목사 이름은 필수입니다.");
        }
        if (request.getCorpName() == null || request.getCorpName().isBlank()) {
            request.setCorpName("기관정보");
        }
        if (request.getBusinessRegistrationNumber() == null || request.getBusinessRegistrationNumber().isBlank()) {
            throw new IllegalArgumentException("사업자등록번호는 필수입니다.");
        }
        if (request.getCreatedBy() == null || request.getCreatedBy().isBlank()) {
            request.setCreatedBy("system");
        }
        if (request.getCreatedIp() == null || request.getCreatedIp().isBlank()) {
            request.setCreatedIp("127.0.0.1");
        }
        if (request.getUpdatedBy() == null || request.getUpdatedBy().isBlank()) {
            request.setUpdatedBy(request.getCreatedBy());
        }
        if (request.getUpdatedIp() == null || request.getUpdatedIp().isBlank()) {
            request.setUpdatedIp(request.getCreatedIp());
        }

        int result = pastorMapper.insertPastorProfile(request);
        if (result != 1) {
            throw new Exception("담임목사 정보 등록에 실패했습니다.");
        }
    }

    @Transactional
    public void updatePastorProfile(Long corpId, PastorRequest request) throws Exception {
        if (request.getUpdatedBy() == null || request.getUpdatedBy().isBlank()) {
            request.setUpdatedBy("system");
        }
        if (request.getUpdatedIp() == null || request.getUpdatedIp().isBlank()) {
            request.setUpdatedIp("127.0.0.1");
        }

        int result = pastorMapper.updatePastorProfile(corpId, request);
        if (result != 1) {
            throw new Exception("담임목사 정보 수정에 실패했습니다.");
        }
    }

    @Transactional
    public void deletePastorProfile(Long corpId, String updatedBy, String updatedIp) throws Exception {
        if (updatedBy == null || updatedBy.isBlank()) {
            updatedBy = "system";
        }
        if (updatedIp == null || updatedIp.isBlank()) {
            updatedIp = "127.0.0.1";
        }

        int result = pastorMapper.softDeletePastorProfile(corpId, updatedBy, updatedIp);
        if (result != 1) {
            throw new Exception("담임목사 정보 삭제에 실패했습니다.");
        }
    }
}
