import { create } from "zustand";
import type { MenuItem } from "./menu.types";
import { getMenuParamMatchScore } from "./menuModel";

type MenuStore = {
  menuList: MenuItem[];
  loading: boolean;
  systemType: string;
  currentMenu: MenuItem | null;
  currentTopMenu: MenuItem | null;
  currentSubMenus: MenuItem[];
  submenuVisible: boolean;
  setLoading: (loading: boolean) => void;
  setMenuList: (systemType: string, menus: MenuItem[]) => void;
  setCurrentByPath: (path: string, search?: string) => void;
};

const cloneMenus = (menus: MenuItem[]): MenuItem[] =>
  menus.map((menu) => ({
    ...menu,
    active: false,
    subMenus: menu.subMenus ? cloneMenus(menu.subMenus) : [],
  }));

const flatten = (menus: MenuItem[]): MenuItem[] => {
  const result: MenuItem[] = [];
  for (const menu of menus) {
    result.push(menu);
    if (menu.subMenus && menu.subMenus.length > 0) {
      result.push(...flatten(menu.subMenus));
    }
  }
  return result;
};

export const useMenuStore = create<MenuStore>((set, get) => ({
  menuList: [],
  loading: false,
  systemType: "official",
  currentMenu: null,
  currentTopMenu: null,
  currentSubMenus: [],
  submenuVisible: false,
  setLoading: (loading) => set({ loading }),
  setMenuList: (systemType, menus) => {
    const normalized = cloneMenus(menus);
    set({ menuList: normalized, systemType });
  },
  setCurrentByPath: (path, search = "") => {
    const menuList = cloneMenus(get().menuList);
    const allMenus = flatten(menuList);

    const matched =
      allMenus
        .filter((menu) => !!menu.path && path.startsWith(menu.path))
        .sort((a, b) => {
          const pathLengthDiff = (b.path?.length ?? 0) - (a.path?.length ?? 0);
          if (pathLengthDiff !== 0) {
            return pathLengthDiff;
          }
          const paramScoreDiff =
            getMenuParamMatchScore(b.param, search) -
            getMenuParamMatchScore(a.param, search);
          if (paramScoreDiff !== 0) {
            return paramScoreDiff;
          }
          return b.level - a.level;
        })[0] ?? null;

    const topMenu =
      matched?.level === 1
        ? matched
        : (menuList.find((menu) => menu.menuId === matched?.parentId) ?? null);

    if (matched) {
      matched.active = true;
    }
    if (topMenu) {
      topMenu.active = true;
    }

    const currentSubMenus = topMenu?.subMenus ?? [];
    currentSubMenus.forEach((menu) => {
      menu.active = menu.menuId === matched?.menuId;
    });

    set({
      menuList,
      currentMenu: matched,
      currentTopMenu: topMenu,
      currentSubMenus,
      submenuVisible: currentSubMenus.length > 0,
    });
  },
}));
