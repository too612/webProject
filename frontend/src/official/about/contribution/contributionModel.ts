export type ContributionAccount = {
  accountType: string;
  accountLabel: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
};

export type ContributionRule = {
  purpose: string;
  abbreviation: string;
};

export type ContributionInfo = {
  title: string;
  subtitle: string;
  namingGuide: string;
  namingExample: string;
  accounts: ContributionAccount[];
  rules: ContributionRule[];
};
