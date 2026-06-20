package com.main.app.official.training.servicegroup;

import com.main.app.official.training.servicegroup.dto.ServiceGroupDto;
import com.main.app.official.training.servicegroup.dto.ServiceGroupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ServiceGroupService {

    private final ServiceGroupMapper serviceGroupMapper;

    @Transactional(readOnly = true)
    public ServiceGroupDto getServiceGroup() {
        return serviceGroupMapper.selectServiceGroup();
    }

    @Transactional
    public void createServiceGroup(ServiceGroupRequest request) throws Exception {
        int result = serviceGroupMapper.insertServiceGroup(request);
        if (result != 1) {
            throw new Exception("섬기는 공동체 정보 등록에 실패했습니다.");
        }
    }

    @Transactional
    public void updateServiceGroup(Long id, ServiceGroupRequest request) throws Exception {
        int result = serviceGroupMapper.updateServiceGroup(id, request);
        if (result != 1) {
            throw new Exception("섬기는 공동체 정보 수정에 실패했습니다.");
        }
    }

    @Transactional
    public void deleteServiceGroup(Long id) throws Exception {
        int result = serviceGroupMapper.deleteServiceGroup(id);
        if (result != 1) {
            throw new Exception("섬기는 공동체 정보 삭제에 실패했습니다.");
        }
    }
}