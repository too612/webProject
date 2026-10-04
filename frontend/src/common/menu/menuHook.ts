import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMenuStore } from "./menuStore";
import { menuApi } from "./menuApi";
import {
  getSystemTypeByPath,
  normalizeMenusForSystem,
} from "./menuModel";

export function useMenu() {
  const location = useLocation();
  const {
    menuList,
    loading,
    systemType,
    loadedSystemType,
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
        setMenuList(resolvedSystemType, normalizedMenus);
      } finally {
        setLoading(false);
      }
    };

    if (loadedSystemType !== resolvedSystemType) {
      void loadMenus();
    }
  }, [
    loadedSystemType,
    resolvedSystemType,
    setLoading,
    setMenuList,
    systemType,
  ]);

  useEffect(() => {
    setCurrentByPath(location.pathname, location.search);
  }, [
    location.pathname,
    location.search,
    setCurrentByPath,
    menuList.length,
    systemType,
  ]);

  return {
    menuList,
    loading,
    currentTopMenu,
    currentSubMenus,
    currentMenu,
    submenuVisible,
  };
}
