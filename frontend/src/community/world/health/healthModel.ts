export const COMMUNITY_WORLD_HEALTH_AGE_GROUPS = ['전체', '20대', '30대', '40대', '50대', '60대+'] as const;

export type CommunityWorldHealthAgeGroup = (typeof COMMUNITY_WORLD_HEALTH_AGE_GROUPS)[number];

export type CommunityWorldHealthDiseaseRow = {
    name?: string;
    desc?: string;
    risk?: string;
    ageGroup?: string;
    [key: string]: unknown;
};
