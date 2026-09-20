package com.main.app.official.about.contribution.dto;

import lombok.Data;

import java.util.List;

@Data
public class ContributionDto {

    private String title;
    private String subtitle;
    private String namingGuide;
    private String namingExample;
    private List<ContributionAccountDto> accounts;
    private List<ContributionRuleDto> rules;
}
