import client from './client';
import type { MenuDto, ApiResponse } from '../types';

export const menuApi = {
  /**
   * 계층 구조 메뉴 조회
   */
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

  /**
   * 최상위 메뉴 조회
   */
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

  /**
   * 경로로 메뉴 찾기
   */
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

  /**
   * 최상위 메뉴 찾기
   */
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
