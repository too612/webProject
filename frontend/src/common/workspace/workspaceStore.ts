import { createStore } from "zustand/vanilla";
import {
  MAX_WORKSPACE_TABS,
  persistedWorkspaceHref,
  restorableTabs,
  workspaceHref,
} from "./workspaceModel";
import type {
  WorkspacePreferences,
  WorkspaceSnapshot,
  WorkspaceTab,
} from "./workspace.types";

export type WorkspaceState = WorkspaceSnapshot &
  WorkspacePreferences & {
    storageAvailable: boolean;
    open: (tab: Omit<WorkspaceTab, "id" | "dirty">) => boolean;
    close: (ids: string[]) => void;
    markDirty: (id: string, dirty: boolean) => void;
    toggleFavorite: (menuId: string) => void;
    toggleGroup: (menuId: string) => void;
    toggleSidebar: () => void;
  };

export function createWorkspaceStore(basePath: string, userId: string) {
  const key = `workspace:v1:${encodeURIComponent(userId)}:${basePath}`;
  let storageAvailable = true;
  const read = (storage: Storage, suffix: string): Record<string, unknown> => {
    let raw: string | null;
    try {
      raw = storage.getItem(`${key}:${suffix}`);
    } catch {
      storageAvailable = false;
      return {};
    }
    try {
      const parsed: unknown = JSON.parse(raw ?? "{}");
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  };
  let session: Record<string, unknown> = {};
  let preferences: Record<string, unknown> = {};
  try {
    session = read(window.sessionStorage, "tabs");
    preferences = read(window.localStorage, "preferences");
  } catch {
    storageAvailable = false;
  }
  const strings = (value: unknown): string[] =>
    Array.isArray(value)
      ? [
          ...new Set(
            value.filter((item): item is string => typeof item === "string"),
          ),
        ].slice(0, 200)
      : [];
  const tabs = restorableTabs(session.tabs, basePath);
  const activeId =
    typeof session.activeId === "string" &&
    tabs.some((tab) => tab.id === session.activeId)
      ? session.activeId
      : (tabs[0]?.id ?? null);
  const store = createStore<WorkspaceState>((set, get) => ({
    tabs,
    activeId,
    favorites: strings(preferences.favorites),
    hiddenGroups: strings(preferences.hiddenGroups),
    sidebarCollapsed: preferences.sidebarCollapsed === true,
    storageAvailable,
    open: (input) => {
      const href = workspaceHref(input.href, basePath);
      if (!href || href === basePath) return false;
      const existing = get().tabs.find((tab) => tab.id === href);
      if (!existing && get().tabs.length >= MAX_WORKSPACE_TABS) return false;
      if (
        existing &&
        get().activeId === href &&
        existing.title === input.title &&
        existing.menuId === input.menuId
      )
        return true;
      set((state) => ({
        tabs: existing
          ? state.tabs.map((tab) =>
              tab.id === href
                ? { ...tab, title: input.title, menuId: input.menuId }
                : tab,
            )
          : [...state.tabs, { ...input, href, id: href, dirty: false }],
        activeId: href,
      }));
      return true;
    },
    close: (ids) =>
      set((state) => {
        const remaining = state.tabs.filter((tab) => !ids.includes(tab.id));
        const index = state.tabs.findIndex((tab) => tab.id === state.activeId);
        return {
          tabs: remaining,
          activeId: remaining.some((tab) => tab.id === state.activeId)
            ? state.activeId
            : (remaining[Math.min(Math.max(0, index - 1), remaining.length - 1)]
                ?.id ?? null),
        };
      }),
    markDirty: (id, dirty) => {
      if (get().tabs.find((tab) => tab.id === id)?.dirty === dirty) return;
      set((state) => ({
        tabs: state.tabs.map((tab) =>
          tab.id === id ? { ...tab, dirty } : tab,
        ),
      }));
    },
    toggleFavorite: (menuId) =>
      set((state) => ({
        favorites: state.favorites.includes(menuId)
          ? state.favorites.filter((id) => id !== menuId)
          : [...state.favorites, menuId],
      })),
    toggleGroup: (menuId) =>
      set((state) => ({
        hiddenGroups: state.hiddenGroups.includes(menuId)
          ? state.hiddenGroups.filter((id) => id !== menuId)
          : [...state.hiddenGroups, menuId],
      })),
    toggleSidebar: () =>
      set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  }));
  store.subscribe((state) => {
    if (!state.storageAvailable) return;
    try {
      const savedTabs = restorableTabs(state.tabs, basePath);
      window.sessionStorage.setItem(
        `${key}:tabs`,
        JSON.stringify({
          tabs: savedTabs.map((tab) => ({ href: tab.href })),
          activeId: state.activeId
            ? persistedWorkspaceHref(state.activeId, basePath)
            : null,
        }),
      );
      window.localStorage.setItem(
        `${key}:preferences`,
        JSON.stringify({
          favorites: state.favorites,
          hiddenGroups: state.hiddenGroups,
          sidebarCollapsed: state.sidebarCollapsed,
        }),
      );
    } catch {
      store.setState({ storageAvailable: false });
    }
  });
  return store;
}
