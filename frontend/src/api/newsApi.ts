import client from './client';
import type { ApiResponse } from '../types';

type PageMeta = {
  title: string;
  path: string;
  section: string;
  template: string;
};

export const newsApi = {
  async getPages() {
    const response = await client.get<ApiResponse<PageMeta[]>>('/official/news/pages');
    return response.data.data ?? [];
  },
};
