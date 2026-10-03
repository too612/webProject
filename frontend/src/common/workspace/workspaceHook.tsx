import { createContext, useContext, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { StoreApi } from "zustand";
import type { WorkspaceState } from "./workspaceStore";
import type { MenuItem } from "../menu/menu.types";

export const WorkspaceTabContext = createContext<{
  store: StoreApi<WorkspaceState>;
  tabId: string;
  active: boolean;
  menu: MenuItem | null;
  actionsTarget: HTMLElement | null;
} | null>(null);

export function useWorkspaceDirty(dirty: boolean) {
  const context = useContext(WorkspaceTabContext);
  const store = context?.store;
  const tabId = context?.tabId;
  useEffect(() => {
    if (store && tabId) store.getState().markDirty(tabId, dirty);
  }, [store, tabId, dirty]);
}

export function useWorkspaceTab() {
  return useContext(WorkspaceTabContext);
}

export function WorkspaceActions({
  children,
}: Readonly<{ children: ReactNode }>) {
  const context = useContext(WorkspaceTabContext);
  if (!context) return <>{children}</>;
  return context.active && context.actionsTarget
    ? createPortal(children, context.actionsTarget)
    : null;
}
