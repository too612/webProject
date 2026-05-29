import client from '../api/api.client';
import type { ApiResponse } from '../api/api.types';
import type { MenuItem as MenuDto } from './menu.types';

export const menuApi = {
  getHierarchicalMenus: async (systemType = 'official'): Promise<MenuDto[]> => {
    try {
      const response = await client.get<ApiResponse<MenuDto[]>>('/menu/hierarchical', {
        params: { systemType },
      });
      return response.data.data || [];
    } catch (error) {
      console.error('메뉴 조회 실패:', error);
      return [];
    }
  },

  getTopMenus: async (systemType = 'official'): Promise<MenuDto[]> => {
    try {
      const response = await client.get<ApiResponse<MenuDto[]>>('/menu/top', {
        params: { systemType },
      });
      return response.data.data || [];
    } catch (error) {
      console.error('최상위 메뉴 조회 실패:', error);
      return [];
    }
  },

  findMenuByPath: async (path: string, systemType = 'official'): Promise<MenuDto | null> => {
    try {
      const response = await client.get<ApiResponse<MenuDto>>('/menu/path', {
        params: { path, systemType },
      });
      return response.data.data || null;
    } catch (error) {
      console.error('메뉴 조회 실패:', error);
      return null;
    }
  },

  findTopMenuByPath: async (path: string, systemType = 'official'): Promise<MenuDto | null> => {
    try {
      const response = await client.get<ApiResponse<MenuDto>>('/menu/top-menu', {
        params: { path, systemType },
      });
      return response.data.data || null;
    } catch (error) {
      console.error('최상위 메뉴 조회 실패:', error);
      return null;
    }
  },
};
