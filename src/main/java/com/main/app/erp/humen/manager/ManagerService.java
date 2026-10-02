package com.main.app.erp.humen.manager;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.humen.manager.dto.ManagerDto;
import com.main.app.erp.humen.manager.dto.ManagerRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service("erpHumenManagerService")
@RequiredArgsConstructor
public class ManagerService {

    private final ManagerMapper managerMapper;

    @Transactional(readOnly = true)
    public Page<ManagerDto.Person> getPersonList(ManagerDto.ListQuery query) {
        Pageable pageable = PageRequest.of(Math.clamp(query.getPage(), 0, Integer.MAX_VALUE),
                Math.clamp(query.getSize(), 1, 100));
        ManagerDto.SearchCondition condition = new ManagerDto.SearchCondition();
        condition.setKeyword(query.getKeyword());
        condition.setDeptCd(query.getDeptCd());
        condition.setGradeCode(query.getGradeCode());
        condition.setPositionCode(query.getPositionCode());
        condition.setEmploymentTypeCode(query.getEmploymentTypeCode());
        condition.setServiceStatusCode(query.getServiceStatusCode());
        condition.setOffset((int) pageable.getOffset());
        condition.setLimit(pageable.getPageSize());

        List<ManagerDto.Person> people = managerMapper.selectPersonList(condition);
        long total = managerMapper.countPersonList(condition);
        return PaginationUtil.toPage(people, pageable, total);
    }

    @Transactional(readOnly = true)
    public ManagerDto.FilterOptions getFilterOptions() {
        ManagerDto.FilterOptions options = new ManagerDto.FilterOptions();
        options.setDepartments(managerMapper.selectDepartmentOptions());
        options.setGrades(managerMapper.selectCodeOptions("102"));
        options.setPositions(managerMapper.selectCodeOptions("103"));
        options.setEmploymentTypes(managerMapper.selectCodeOptions("104"));
        options.setServiceStatuses(managerMapper.selectCodeOptions("101"));
        return options;
    }

    @Transactional(readOnly = true)
    public ManagerDto.PersonDetail getPersonDetail(String employeeNo) {
        ManagerDto.PersonDetail person = managerMapper.selectPersonDetail(employeeNo);
        if (person == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "인사정보를 찾을 수 없습니다.");
        }
        person.setCareers(managerMapper.selectCareerList(person.getPersonKey()));
        person.setAssignments(managerMapper.selectAssignmentList(person.getPersonKey()));
        return person;
    }

    @Transactional
    public void createPerson(ManagerRequest request) {
        if (request == null || request.getEmployeeNo() == null || request.getEmployeeNo().isBlank()
                || request.getNameKo() == null || request.getNameKo().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "사번과 성명은 필수입니다.");
        }
        String employeeNo = request.getEmployeeNo().trim();
        if (managerMapper.countByEmployeeNo(employeeNo) > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 사번입니다.");
        }
        request.setEmployeeNo(employeeNo);
        request.setNameKo(request.getNameKo().trim());
        if (request.getServiceStatusCode() == null || request.getServiceStatusCode().isBlank()) {
            request.setServiceStatusCode("101-010");
        }
        managerMapper.insertPerson(request, "SYSTEM");
    }
}
