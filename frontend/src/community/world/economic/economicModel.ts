export type CommunityWorldEconomicIndexRow = {
    name?: string;
    value?: string;
    diff?: string;
    [key: string]: unknown;
};

export type CommunityWorldEconomicGuideRow = {
    sector?: string;
    keyword?: string;
    trend?: string;
    memo?: string;
    [key: string]: unknown;
};

export type CommunityWorldEconomicData = {
    indices?: CommunityWorldEconomicIndexRow[];
    rows?: CommunityWorldEconomicGuideRow[];
};
