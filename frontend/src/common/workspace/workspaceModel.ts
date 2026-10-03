import type { MenuItem } from "../menu/menu.types";
import { getMenuParamMatchScore } from "../menu/menuModel";
import type { WorkspaceTab } from "./workspace.types";

export const MAX_WORKSPACE_TABS = 8;

export function workspaceHref(href: string, basePath: string): string | null {
  try {
    const url = new URL(href, window.location.origin);
    if (
      url.origin !== window.location.origin ||
      (url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`))
    )
      return null;
    url.searchParams.sort();
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

export function flattenWorkspaceMenus(menus: MenuItem[]): MenuItem[] {
  return menus.flatMap((menu) => [
    menu,
    ...flattenWorkspaceMenus(menu.subMenus ?? []),
  ]);
}

export function workspaceMenuTrail(
  menus: MenuItem[],
  href: string,
): MenuItem[] {
  const url = new URL(href, window.location.origin);
  const candidates: { trail: MenuItem[]; score: number }[] = [];
  const visit = (items: MenuItem[], trail: MenuItem[]) => {
    for (const menu of items) {
      const next = [...trail, menu];
      const path = menu.path?.split("?")[0];
      const score = getMenuParamMatchScore(menu.param, url.search);
      if (
        path &&
        (url.pathname === path || url.pathname.startsWith(`${path}/`)) &&
        score > 0
      ) {
        candidates.push({ trail: next, score });
      }
      visit(menu.subMenus ?? [], next);
    }
  };
  visit(menus, []);
  candidates.sort((left, right) => {
    const [leftMenu] = left.trail.slice(-1);
    const [rightMenu] = right.trail.slice(-1);
    return (
      rightMenu.path.length - leftMenu.path.length ||
      right.score - left.score ||
      right.trail.length - left.trail.length
    );
  });
  return candidates[0]?.trail ?? [];
}

export function persistedWorkspaceHref(
  href: string,
  basePath: string,
): string | null {
  const normalized = workspaceHref(href, basePath);
  if (!normalized) return null;
  const url = new URL(normalized, window.location.origin);
  const allowed = new Set([
    "page",
    "size",
    "sort",
    "type",
    "category",
    "view",
    "status",
    "tab",
    "year",
    "month",
  ]);
  url.search = new URLSearchParams(
    [...url.searchParams.entries()].filter(([key]) => allowed.has(key)),
  ).toString();
  return `${url.pathname}${url.search}`;
}

export function restorableTabs(
  value: unknown,
  basePath: string,
): WorkspaceTab[] {
  if (!Array.isArray(value)) return [];
  const tabs: WorkspaceTab[] = [];
  for (const item of value) {
    if (!item || typeof item.href !== "string") continue;
    const href = persistedWorkspaceHref(item.href, basePath);
    if (!href || href === basePath || tabs.some((tab) => tab.id === href))
      continue;
    tabs.push({ id: href, href, title: "작업", dirty: false });
    if (tabs.length === MAX_WORKSPACE_TABS) break;
  }
  return tabs;
}
