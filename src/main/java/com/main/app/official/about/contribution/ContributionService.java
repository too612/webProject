package com.main.app.official.about.contribution;

import com.main.app.official.about.contribution.dto.ContributionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("officialAboutContributionService")
@RequiredArgsConstructor
public class ContributionService {

    private final ContributionMapper contributionMapper;

    @Transactional(readOnly = true)
    public ContributionDto getInfo() {
        ContributionDto contribution = contributionMapper.selectInfo();
        contribution.setAccounts(contributionMapper.selectAccounts());
        contribution.setRules(contributionMapper.selectRules());
        return contribution;
    }
}
