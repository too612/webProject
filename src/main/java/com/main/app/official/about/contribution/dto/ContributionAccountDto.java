package com.main.app.official.about.contribution.dto;

import lombok.Data;

@Data
public class ContributionAccountDto {

    private String accountType;
    private String accountLabel;
    private String bankName;
    private String accountNumber;
    private String accountHolder;
}
