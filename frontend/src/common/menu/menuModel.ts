import type { MenuItem } from "./menu.types";

export const findMenuById = (
  menus: MenuItem[],
  menuId: string,
): MenuItem | null => {
  for (const menu of menus) {
    if (menu.menuId === menuId) {
      return menu;
    }

    const matched = menu.subMenus ? findMenuById(menu.subMenus, menuId) : null;
    if (matched) {
      return matched;
    }
  }

  return null;
};

export const getMenuPageContent = (
  menus: MenuItem[],
  menuId: string,
  loading: boolean,
) => {
  const menu = findMenuById(menus, menuId);

  return {
    headline: loading ? "페이지 정보를 불러오는 중" : (menu?.menuName ?? ""),
    summary: loading
      ? "페이지 설명을 불러오는 중"
      : (menu?.menuSummary ?? null),
  };
};

export const getCurrentMenuPageContent = (
  currentMenu: MenuItem | null,
  loading: boolean,
) => ({
  headline: loading
    ? "페이지 정보를 불러오는 중"
    : (currentMenu?.menuName ?? ""),
  summary: loading
    ? "페이지 설명을 불러오는 중"
    : (currentMenu?.menuSummary ?? null),
});

const normalizeMenuParam = (param?: string | null): string => {
  const trimmedParam = param?.trim() ?? "";
  return trimmedParam.startsWith("?") ? trimmedParam.slice(1) : trimmedParam;
};

export const buildMenuLink = (menu?: MenuItem | null): string => {
  if (!menu) return "/";
  const basePath = menu.path || menu.menuUrl || "/";
  const normalizedParam = normalizeMenuParam(menu.param);
  if (!normalizedParam) return basePath;
  return `${basePath}${basePath.includes("?") ? "&" : "?"}${normalizedParam}`;
};

export const menuParamMatches = (
  menuParam: string | null | undefined,
  currentSearch: string,
): boolean => {
  const normalizedParam = normalizeMenuParam(menuParam);
  if (!normalizedParam) {
    return !currentSearch || currentSearch === "?";
  }
  const requiredParams = new URLSearchParams(normalizedParam);
  const currentParams = new URLSearchParams(currentSearch);
  for (const [key, value] of requiredParams.entries()) {
    if (currentParams.get(key) !== value) {
      return false;
    }
  }
  return true;
};

export const getMenuParamMatchScore = (
  menuParam: string | null | undefined,
  currentSearch: string,
): number => {
  const normalizedParam = normalizeMenuParam(menuParam);
  if (!normalizedParam) return 1;
  return menuParamMatches(normalizedParam, currentSearch) ? 2 : 0;
};

export const getSystemTypeByPath = (pathname: string) => {
  if (pathname.startsWith("/community")) return "community";
  if (pathname.startsWith("/erp")) return "erp";
  if (pathname.startsWith("/mypage")) return "mypage";
  if (pathname.startsWith("/system")) return "system";
  return "official";
};

export const normalizeMenusForSystem = (
  systemType: string,
  menus: MenuItem[],
): MenuItem[] => {
  if (systemType !== "mypage") return menus;
  const normalizePath = (path?: string): string => {
    if (!path) return "";
    return path.startsWith("/user/") ? `/mypage${path}` : path;
  };
  const normalizeItem = (menu: MenuItem): MenuItem => ({
    ...menu,
    path: normalizePath(menu.path),
    menuUrl: normalizePath(menu.menuUrl),
    subMenus: (menu.subMenus ?? []).map(normalizeItem),
  });
  return menus.map(normalizeItem);
};
