package com.main.app.service.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import com.main.app.mapper.AutoNoMapper;
import com.main.app.service.AutoNoService;

@Service
public class AutoNoServiceImpl implements AutoNoService {

    @Autowired
    private AutoNoMapper autoMapper;

    @Override
    @Transactional
    public String getKey(Map<String, Object> map) {
        // 입력받은 map에 필요한 정보가 모두 있으므로, 키 이름을 MyBatis Mapper에서 사용하는 이름으로 통일해줍니다.
        // BoardServiceImpl에서 "REG_DT"로 넣었으므로 "REG_DATE"로 변경합니다.
        map.put("REG_DATE", map.get("REG_DT"));
        map.put("PRE_FIX", map.get("pre_fix"));
        
        // 1. 마스터 정보 조회 (현재 코드에서는 사용되지 않지만, 로직 검증을 위해 유지)
        // Map<String, Object> mst = autoMapper.selectAutoInfo(map);
        
        // 2. 오늘 날짜의 상세 정보가 있는지 확인
        Map<String, Object> dtl = autoMapper.selectAutoDtlInfo(map);
        
        // 3. 상세 정보가 없으면 새로 생성(INSERT), 있으면 카운트 증가(UPDATE)
        if (dtl == null || dtl.isEmpty()) {
            autoMapper.insertAutoDtl(map);
        } else {
            autoMapper.updateAutoDtl(map);
        }
        
        // 4. 완성된 키 값을 조회하여 반환
        return autoMapper.getAutoNoKey(map);
    }
}
