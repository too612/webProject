package com.main.app.official.about.contribution;

import com.main.app.official.about.contribution.dto.ContributionAccountDto;
import com.main.app.official.about.contribution.dto.ContributionDto;
import com.main.app.official.about.contribution.dto.ContributionRuleDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ContributionMapper {

    ContributionDto selectInfo();

    List<ContributionAccountDto> selectAccounts();

    List<ContributionRuleDto> selectRules();
}
