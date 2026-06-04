package com.main.app.common.corp;

import com.main.app.common.corp.dto.CorpDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("commonCorpService")
@RequiredArgsConstructor
public class CorpService {

    private final CorpMapper corpMapper;

    @Transactional(readOnly = true)
    public CorpDto getInfo(String sessIp) {
        return corpMapper.selectCorpInfo(sessIp);
    }
}