package com.main.app.erp.humen.myprofile;

import java.util.List;

import com.main.app.erp.humen.myprofile.dto.MyProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service("erpHumenMyProfileService")
@RequiredArgsConstructor
public class MyProfileService {

    private final MyProfileMapper myprofileMapper;

    @Transactional(readOnly = true)
    public MyProfileDto.Profile getMyProfile(String userId) {
        MyProfileDto.Profile profile = myprofileMapper.selectProfileByUserId(userId);
        if (profile == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자 정보를 찾을 수 없습니다.");
        }
        if (profile.getEmployeeNo() == null || profile.getEmployeeNo().isBlank()) {
            profile.setEmployeeLinked(false);
            profile.setAssignments(List.of());
            profile.setCareers(List.of());
            profile.setEducations(List.of());
            return profile;
        }

        String personKey = myprofileMapper.selectPersonKeyByUserId(userId);
        if (personKey == null || personKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "연결된 인사정보를 찾을 수 없습니다.");
        }
        profile.setAssignments(myprofileMapper.selectAssignments(personKey));
        profile.setCareers(myprofileMapper.selectCareers(personKey));
        profile.setEducations(myprofileMapper.selectEducations(personKey));
        profile.setEmployeeLinked(true);
        return profile;
    }

    @Transactional
    public void updateOwnContactInfo(String userId, MyProfileDto.ContactUpdate request) {
        if (request == null || request.getEmail() == null || request.getEmail().isBlank()
                || request.getPhone() == null || request.getPhone().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이메일과 연락처는 필수입니다.");
        }

        String email = request.getEmail().trim();
        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "올바른 이메일 주소를 입력하세요.");
        }
        request.setEmail(email);
        request.setPhone(request.getPhone().trim());
        request.setPostalCode(normalizeOptional(request.getPostalCode()));
        request.setAddressLine1(normalizeOptional(request.getAddressLine1()));
        request.setAddressLine2(normalizeOptional(request.getAddressLine2()));

        MyProfileDto.Profile profile = myprofileMapper.selectProfileByUserId(userId);
        if (profile == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자 정보를 찾을 수 없습니다.");
        }
        if (myprofileMapper.updateOwnContactInfo(userId, request) != 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "계정 정보가 변경되지 않았습니다. 다시 시도하세요.");
        }
    }

    private String normalizeOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
