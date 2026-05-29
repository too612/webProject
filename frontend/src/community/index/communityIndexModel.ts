export type CommunityIndexPostItem = {
    id: string;
    category: string;
    title: string;
    author: string;
    date: string;
    views: number;
};

export type CommunityIndexNoticeItem = {
    id: string;
    title: string;
    date: string;
};

export type CommunityIndexActivityItem = {
    id: string;
    category: string;
    title: string;
    date: string;
};

export type CommunityIndexData = {
    recentPosts: CommunityIndexPostItem[];
    notices: CommunityIndexNoticeItem[];
    activities: CommunityIndexActivityItem[];
    stats: {
        totalMembers: number;
        totalPosts: number;
    };
};

export const EMPTY_COMMUNITY_INDEX: CommunityIndexData = {
    recentPosts: [],
    notices: [],
    activities: [],
    stats: {
        totalMembers: 0,
        totalPosts: 0,
    },
};
