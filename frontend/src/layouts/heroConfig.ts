import type { MenuItem } from "../common/menu/menu.types";

export type HeroConfig = {
  enabled: boolean;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  compact?: boolean;
};

const normalizeImagePath = (imagePath?: string | null) => {
  if (!imagePath?.trim()) {
    return undefined;
  }

  const trimmed = imagePath.trim();
  if (trimmed.startsWith("/img/")) {
    return trimmed;
  }

  const normalized = trimmed.startsWith("/") ? trimmed : "/" + trimmed;
  return "/img/menu" + normalized;
};

const resolveMenuSummary = (
  menu?: Partial<
    Pick<MenuItem, "menuName" | "menuSummary" | "menuImagePath">
  > | null,
) => {
  if (!menu) {
    return undefined;
  }

  return menu.menuSummary?.trim() || undefined;
};

export function resolveHeroConfig(
  pathname: string,
  menu?: Partial<
    Pick<MenuItem, "menuName" | "menuSummary" | "menuImagePath">
  > | null,
): HeroConfig {
  const menuName = menu?.menuName?.trim() ?? "";

  if (!menuName) {
    return { enabled: false, title: "" };
  }

  const summary = resolveMenuSummary(menu);
  const imageUrl = normalizeImagePath(menu?.menuImagePath);

  if (pathname.startsWith("/erp")) {
    return {
      enabled: true,
      title: menuName,
      subtitle: summary,
      imageUrl,
      compact: true,
    };
  }

  if (pathname.startsWith("/system")) {
    return { enabled: false, title: menuName };
  }

  if (pathname.startsWith("/mypage")) {
    return {
      enabled: true,
      title: menuName,
      subtitle: summary,
      imageUrl,
      compact: true,
    };
  }

  return {
    enabled: true,
    title: menuName,
    subtitle: summary,
    imageUrl,
  };
}
