import type { LucideIcon } from "lucide-react";

export type WorkspaceMenuPresentation = Record<
  string,
  { label: string; icon: LucideIcon }
>;

export type WorkspaceTab = {
  id: string;
  href: string;
  title: string;
  menuId?: string;
  dirty: boolean;
};

export type WorkspacePreferences = {
  favorites: string[];
  hiddenGroups: string[];
  sidebarCollapsed: boolean;
};

export type WorkspaceSnapshot = {
  tabs: WorkspaceTab[];
  activeId: string | null;
};
