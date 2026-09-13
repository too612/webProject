package com.main.app.official.about.people;

import com.main.app.official.about.people.dto.PeopleDto;
import com.main.app.official.about.people.dto.PeopleCareerRowDto;
import com.main.app.official.about.people.dto.PeopleEducationRowDto;
import com.main.app.official.about.people.dto.PeopleMemberRowDto;
import com.main.app.official.about.people.dto.PeopleRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PeopleService {

    private final PeopleMapper peopleMapper;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy.MM.dd");

    @Transactional(readOnly = true)
    public PeopleDto getPeople() {
        List<PeopleMemberRowDto> rows = peopleMapper.selectPeopleMembers();
        rows.removeIf(row -> "원로목사".equals(row.getGradeName()));

        PeopleDto response = new PeopleDto();
        response.setHeadline("섬기는 사람들");
        response.setSummary("다사랑교회를 섬기는 교역자와 성도님들을 소개합니다.");

        if (rows == null || rows.isEmpty()) {
            PeopleDto.PastorProfile emptyPastor = new PeopleDto.PastorProfile();
            emptyPastor.setName("등록된 구성원이 없습니다.");
            emptyPastor.setTitle("-");
            emptyPastor.setGreeting("표시할 인사 데이터가 없습니다.");
            response.setPastor(emptyPastor);
            response.setLeaders(new ArrayList<>());
            return response;
        }

        int pastorIndex = findMainPastorIndex(rows);
        PeopleMemberRowDto pastorRow = rows.get(pastorIndex);

        PeopleDto.PastorProfile pastor = new PeopleDto.PastorProfile();
        pastor.setName(firstNonBlank(pastorRow.getNameKo(), "이름 미정"));
        pastor.setTitle(firstNonBlank(pastorRow.getGradeName(), "직급 미정"));
        pastor.setGreeting(firstNonBlank(
                pastorRow.getAiSummary(),
                firstNonBlank(pastorRow.getPositionName(), "섬기는 분") + "으로 함께 섬기고 있습니다."
        ));
        applyDetails(pastor, pastorRow);
        pastor.setImageUrl(normalizeImageUrl(firstNonBlank(pastorRow.getProfilePhotoUrl(), pastorRow.getPhotoUrl())));
        response.setPastor(pastor);

        List<PeopleDto.LeaderCard> leaders = new ArrayList<>();
        for (int i = 0; i < rows.size(); i++) {
            if (i == pastorIndex) {
                continue;
            }
            PeopleMemberRowDto row = rows.get(i);
            PeopleDto.LeaderCard card = new PeopleDto.LeaderCard();
            card.setName(firstNonBlank(row.getNameKo(), "이름 미정"));
            card.setRole(firstNonBlank(row.getGradeName(), "직급 미정"));
            card.setMinistry(buildMinistry(row));
            card.setIntro(firstNonBlank(
                    row.getAiSummary(),
                    firstNonBlank(row.getServiceStatusName(), "재직") + " 상태로 섬기고 있습니다."
            ));
            applyDetails(card, row);
            card.setImageUrl(normalizeImageUrl(firstNonBlank(row.getProfilePhotoUrl(), row.getPhotoUrl())));
            leaders.add(card);
        }
        response.setLeaders(leaders);
        return response;
    }

    @Transactional
    public void createPeople(PeopleRequest request) throws Exception {
        int result = peopleMapper.insertPeople(request);
        if (result != 1) {
            throw new Exception("섬기는 사람들 정보 등록에 실패했습니다.");
        }
    }

    @Transactional
    public void updatePeople(Long id, PeopleRequest request) throws Exception {
        int result = peopleMapper.updatePeople(id, request);
        if (result != 1) {
            throw new Exception("섬기는 사람들 정보 수정에 실패했습니다.");
        }
    }

    @Transactional
    public void deletePeople(Long id) throws Exception {
        int result = peopleMapper.deletePeople(id);
        if (result != 1) {
            throw new Exception("섬기는 사람들 정보 삭제에 실패했습니다.");
        }
    }

    private int findMainPastorIndex(List<PeopleMemberRowDto> rows) {
        for (int i = 0; i < rows.size(); i++) {
            if (rows.get(i).getGradeName() != null
                    && rows.get(i).getGradeName().contains("담임목사")) {
                return i;
            }
        }
        return 0;
    }

    private String buildMinistry(PeopleMemberRowDto row) {
        String positionName = firstNonBlank(row.getPositionName(), "직위 미정");
        String dept = firstNonBlank(row.getDeptName(), "부서 미정");
        return positionName + " / " + dept;
    }

    private void applyDetails(PeopleDto.PastorProfile profile, PeopleMemberRowDto row) {
        profile.setEducations(mapEducations(row.getEmployeeNo()));
        profile.setCareers(mapCareers(row.getEmployeeNo()));
    }

    private void applyDetails(PeopleDto.LeaderCard profile, PeopleMemberRowDto row) {
        profile.setEducations(mapEducations(row.getEmployeeNo()));
        profile.setCareers(mapCareers(row.getEmployeeNo()));
    }

    private List<PeopleDto.Education> mapEducations(String employeeNo) {
        List<PeopleEducationRowDto> rows = peopleMapper.selectPeopleEducations(employeeNo);
        List<PeopleDto.Education> educations = new ArrayList<>();
        for (PeopleEducationRowDto row : rows) {
            PeopleDto.Education education = new PeopleDto.Education();
            education.setSchoolTypeName(firstNonBlank(row.getSchoolTypeName(), "학교"));
            education.setSchoolName(row.getSchoolName());
            education.setDegreeName(row.getDegreeName());
            education.setMajor(row.getMajor());
            education.setGraduationStatusName(row.getGraduationStatusName());
            education.setAdmissionDate(formatDate(row.getAdmissionDate()));
            education.setGraduationDate(formatDate(row.getGraduationDate()));
            education.setFinalEducation(row.isFinalEducation());
            educations.add(education);
        }
        return educations;
    }

    private List<PeopleDto.Career> mapCareers(String employeeNo) {
        List<PeopleCareerRowDto> rows = peopleMapper.selectPeopleCareers(employeeNo);
        List<PeopleDto.Career> careers = new ArrayList<>();
        for (PeopleCareerRowDto row : rows) {
            PeopleDto.Career career = new PeopleDto.Career();
            career.setCompanyName(row.getCompanyName());
            career.setHireDate(formatDate(row.getHireDate()));
            career.setRetireDate(formatDate(row.getRetireDate()));
            career.setEmploymentTypeName(row.getEmploymentTypeName());
            career.setJobTitle(row.getJobTitle());
            career.setJobResponsibility(row.getJobResponsibility());
            careers.add(career);
        }
        return careers;
    }

    private String formatDate(java.time.LocalDate date) {
        return date == null ? null : date.format(DATE_FORMATTER);
    }

    private String firstNonBlank(String value, String defaultValue) {
        return isNotBlank(value) ? value : defaultValue;
    }

    private boolean isNotBlank(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private String normalizeImageUrl(String imageUrl) {
        if (!isNotBlank(imageUrl)) {
            return null;
        }
        String trimmed = imageUrl.trim();
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
            return trimmed;
        }
        return "/" + trimmed;
    }
}