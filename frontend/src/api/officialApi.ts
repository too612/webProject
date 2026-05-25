import client from './client';
import type { ApiResponse } from '../types';

export type OfficialIndexItem = {
  id: string;
  title: string;
  date: string;
};

export type OfficialIndexData = {
  recentSermons: OfficialIndexItem[];
  recentAnnouncements: OfficialIndexItem[];
};

export const officialApi = {
  async getIndexData(): Promise<OfficialIndexData> {
    const response = await client.get<ApiResponse<OfficialIndexData>>('/official/index');
    return response.data.data ?? { recentSermons: [], recentAnnouncements: [] };
  },
};
