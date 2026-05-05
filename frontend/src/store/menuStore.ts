import { create } from 'zustand';
import type { MenuItem } from '../types/menu.types';

type MenuStore = {
    menuList: MenuItem[];
    systemType: string;
    currentMenu: MenuItem | null;
    currentTopMenu: MenuItem | null;
    currentSubMenus: MenuItem[];
    submenuVisible: boolean;
    setMenuList: (systemType: string, menus: MenuItem[]) => void;
    setCurrentByPath: (path: string) => void;
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
    systemType: 'official',
    currentMenu: null,
    currentTopMenu: null,
    currentSubMenus: [],
    submenuVisible: false,
    setMenuList: (systemType, menus) => {
        const normalized = cloneMenus(menus);
        set({ menuList: normalized, systemType });
    },
    setCurrentByPath: (path) => {
        const menuList = cloneMenus(get().menuList);
        const allMenus = flatten(menuList);

        const matched = allMenus
            .filter((menu) => !!menu.path && path.startsWith(menu.path))
            .sort((a, b) => (b.path?.length ?? 0) - (a.path?.length ?? 0))[0] ?? null;

        const topMenu =
            matched?.level === 1
                ? matched
                : menuList.find((menu) => menu.menuId === matched?.parentId) ?? null;

        if (matched) {
            matched.active = true;
        }
        if (topMenu) {
            topMenu.active = true;
        }

        const currentSubMenus = topMenu?.subMenus ?? [];
        currentSubMenus.forEach((menu) => {
            menu.active = menu.path === matched?.path;
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
