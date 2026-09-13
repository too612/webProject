import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMenuStore } from "./menuStore";
import { menuApi } from "./menuApi";
import {
  fallbackMenus,
  fallbackMenuBySystem,
  getSystemTypeByPath,
  normalizeMenusForSystem,
} from "./menuModel";

export function useMenu() {
  const location = useLocation();
  const {
    menuList,
    loading,
    systemType,
    currentTopMenu,
    currentSubMenus,
    currentMenu,
    submenuVisible,
    setLoading,
    setMenuList,
    setCurrentByPath,
  } = useMenuStore();

  const resolvedSystemType = getSystemTypeByPath(location.pathname);

  useEffect(() => {
    const loadMenus = async () => {
      setLoading(true);
      try {
        const menus = await menuApi.getHierarchicalMenus(resolvedSystemType);
        const normalizedMenus = normalizeMenusForSystem(
          resolvedSystemType,
          menus,
        );
        const fallback =
          fallbackMenuBySystem[resolvedSystemType] ?? fallbackMenus;
        setMenuList(
          resolvedSystemType,
          normalizedMenus.length > 0 ? normalizedMenus : fallback,
        );
      } finally {
        setLoading(false);
      }
    };

    if (menuList.length === 0 || systemType !== resolvedSystemType) {
      void loadMenus();
    }
  }, [
    menuList.length,
    resolvedSystemType,
    setLoading,
    setMenuList,
    systemType,
  ]);

  useEffect(() => {
    setCurrentByPath(location.pathname);
  }, [location.pathname, setCurrentByPath, menuList.length, systemType]);

  return {
    menuList,
    loading,
    currentTopMenu,
    currentSubMenus,
    currentMenu,
    submenuVisible,
  };
}
